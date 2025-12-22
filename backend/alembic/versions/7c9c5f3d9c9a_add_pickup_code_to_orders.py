"""add pickup code to orders"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "7c9c5f3d9c9a"
down_revision = "24b2bbd40025"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("pickup_code", sa.String(), nullable=True))
    op.create_unique_constraint(
        "uq_orders_pickup_code", "orders", ["pickup_code"]
    )


def downgrade() -> None:
    op.drop_constraint("uq_orders_pickup_code", "orders", type_="unique")
    op.drop_column("orders", "pickup_code")

