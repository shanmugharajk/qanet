from enum import Enum


class UserRoles(int, Enum):
    admin = 0
    superadmin = 1
    user = 2
