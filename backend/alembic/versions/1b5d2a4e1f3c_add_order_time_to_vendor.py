"""add order_time to vendor"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1b5d2a4e1f3c"
down_revision = "7c9c5f3d9c9a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("vendors", sa.Column("order_time", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("vendors", "order_time")

