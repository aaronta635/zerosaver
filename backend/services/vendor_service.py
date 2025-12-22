from arq import ArqRedis

from core.errors import InvalidRequest, ResourcesExist
from crud import CRUDAuthUser, CRUDOtp, CRUDVendor
from models.auth_user import AuthUser
from schemas.base import RoleAuthDetailsUpdate, Roles
from schemas import OTPCreate, OTPType, VendorCreate, VendorUpdate


class VendorService:

    def __init__(
        self,
        crud_auth_user: CRUDAuthUser,
        crud_otp: CRUDOtp,
        crud_vendor: CRUDVendor,
        queue_connection: ArqRedis,
    ):
        self.crud_auth_user = crud_auth_user
        self.crud_vendor = crud_vendor
        self.crud_otp = crud_otp
        self.queue_connection = queue_connection

    async def create_vendor(
        self,
        data_obj: VendorCreate,
        current_user: AuthUser,
    ):

        auth_user = self.crud_vendor.get_by_auth_id(current_user.id)

        if auth_user:
            raise ResourcesExist("Vendor exists")
        if current_user.default_role != Roles.VENDOR:
            raise InvalidRequest("Role must be Vendor to create vendor account")
        if self.crud_vendor.get_by_username(data_obj.username):
            raise ResourcesExist("username taken")
        data_obj.auth_id = current_user.id
        vendor = await self.crud_vendor.create(data_obj)
        vendor_auth_details = RoleAuthDetailsUpdate(
            first_name=data_obj.first_name,
            last_name=data_obj.last_name,
            phone_number=data_obj.phone_number,
            role_id=vendor.id,
        )
        await self.queue_connection.enqueue_job(
            "update_auth_details", current_user.id, vendor_auth_details
        )
        otp_data_obj = OTPCreate(auth_id=current_user.id, otp_type=OTPType.PHONE_NUMBER)
        await self.queue_connection.enqueue_job(
            "send_email_otp", otp_data_obj, current_user.email
        )
        return vendor

    async def update_vendor(
        self,
        data_obj: VendorUpdate,
        current_user: AuthUser,
    ):
        if current_user.default_role != Roles.VENDOR:
            raise InvalidRequest("Role must be Vendor to update vendor account")

        vendor = self.crud_vendor.get_by_auth_id(current_user.id)
        if not vendor:
            raise InvalidRequest("Create vendor account first")

        updated_vendor = await self.crud_vendor.update(id=vendor.id, data_obj=data_obj)

        # keep auth details in sync when names/phone change
        should_sync_auth = any(
            [data_obj.first_name, data_obj.last_name, data_obj.phone_number]
        )
        if should_sync_auth:
            vendor_auth_details = RoleAuthDetailsUpdate(
                first_name=data_obj.first_name or vendor.first_name,
                last_name=data_obj.last_name or vendor.last_name,
                phone_number=data_obj.phone_number or vendor.phone_number,
                role_id=vendor.id,
            )
            await self.queue_connection.enqueue_job(
                "update_auth_details", current_user.id, vendor_auth_details
            )

        return updated_vendor
