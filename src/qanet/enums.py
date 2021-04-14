from enum import Enum


class UserRoles(int, Enum):
    admin = 0
    superadmin = 1
    user = 2


class PostType(int, Enum):
    question = 0
    answer = 1
