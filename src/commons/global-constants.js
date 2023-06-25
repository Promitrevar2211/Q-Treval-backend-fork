export const MEMBER_MESSAGE = {
  MEMBER_CREATED: "Success, Member created successfully",
  MEMBER_UPDATED: "Success, Member updated successfully",
  MEMBER_DELETED: "Success, Member deleted successfully",
  MEMBER_FOUND: "Success, Member found",
};

export const USER_MESSAGE = {
  USER_CREATED: "Success, User created successfully",
  USER_UPDATED: "Success, User updated successfully",
  USER_DELETED: "Success, User deleted successfully",
  USER_FOUND: "Success, User found",
};

export const CATEGORY_MESSAGE = {
  CATEGORY_CREATED: "Success, Category created successfully",
  CATEGORY_DELETED: "Success, Category deleted successfully",
  CATEGORY_FOUND: "Success, Category found",
  CATEGORY_PRESENT : "Success, Category is already present"
};

export const validFile = [
  "image/png",
  "text/plain",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/jpeg",
  "image/jpg",
];

export const NEWS_MESSAGE = {
  NEWS_CREATED: "Success, News created successfully",
  NEWS_UPDATED: "Success, News updated successfully",
  NEWS_DELETED: "Success, News deleted successfully",
  NEWS_FOUND: "Success, News found",
  NEWS_APPROVED : "Success, News Approved successfully"
};

export const POST_MESSAGE = {
  POST_CREATED: "Success, Post created successfully",
  POST_UPDATED: "Success, Post updated successfully",
  POST_DELETED: "Success, Post deleted successfully",
  POST_FOUND: "Success, Post found",
  POST_APPROVED : "Success, Post Approved successfully"
};

export const ERROR = {
  PRIVATE_KEY_MISS: "Error: Private key not found.",
  PRIVATE_KEY_MISS_MATCH: "Error: Please provide a valid private key.",
  PROVIDE_TOKEN_ERROR: "Error: Please provide a valid token.",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again.",
  TOKEN_EXPIRED: "Error: Token expired. Please login again.",
  PROVIDE_SERVICE_KEY: "Error: Please provide a service API key.",
  INVALID_SERVICE_KEY: "Error: Invalid service API key.",
  PROVIDE_TOKEN_SERVICE_ERROR:
    "Error: Please provide a valid redirection token.",
};

export const USER = {
  LOGIN_OTP: "Success: OTP has been sent to the registered mobile number.",
  ALREADY_EXIST:
    "Error: User already exists with the provided email address or phone number.",
  REGISTER_SUCCESS: "Success: User registered successfully.",
  LOGIN_SUCCESS: "Success: User logged in successfully.",
  LOGIN_FAILED: "Error: Login failed.",
  LOGOUT_SUCCESS: "Success: User logged out successfully.",
  LOGOUT_FAILED: "Error: Logout failed.",
  USER_NOT_FOUND: "Error: User not found.",
  JWT_TOKEN_GENERATED: "Success: JWT token generated successfully.",
};

export const FILE_MESSAGE = {
  ATTACHMENT_FILE_ERROR: `Error, Please provide valid file`,
  NOT_VALID: `Error, Please provide valid file type`,
  FILE_SIZE_EXCEED: `Error, file is too large.`,
  UPLOADED: `Success, Upload successfully`,
  FILE_VIEW: `Success, presigned URL is generated.`,
  FILE_DELETED: `Success, file deleted successfully`,
};
export const PROJECT_MESSAGE = {
  PROJECT_NOT_FOUND: "Error, Project not found",
  PROJECT_ALREADY_EXISTS: "Error, Project already exists",
  PROJECT_CREATED: "Success, Project created successfully",
  PROJECT_UPDATED: "Success, Project updated successfully",
  PROJECT_DELETED: "Success, Project deleted successfully",
  PROJECT_FOUND: "Success, Project found",
};

export const TEMPLATE_MESSAGE = {
  PROJECT_NOT_FOUND: "Error, Project not found",
  PROJECT_ALREADY_EXISTS: "Error, Project already exists",
  TEMPLATE_CREATED: "Success, Template created successfully",
  TEMPLATE_UPDATED: "Success, Template updated successfully",
  TEMPLATE_DELETED: "Success, Template deleted successfully",
  TEMPLATE_FOUND: "Success, Project found",
};

export const DOCUMENT_MESSAGE = {
  DOCUMENT_CREATED: "Success, Document created successfully",
  DOCUMENT_UPDATED: "Success, Document updated successfully",
  DOCUMENT_DELETED: "Success, Document deleted successfully",
  DOCUMENT_FOUND: "Success, Project found",
};

export const OTP = {
  NO_OTP: `Error, No Pending OTP Found`,
  INVAILD_OTP: `Error, Invalid OTP`,
  USED_OTP: `Error,OTP has already been used.`,
  EXPIRED_OTP: `Error, OTP has expired`,
  VERIFIED_OTP: `Sucess, OTP verified successfully`,
  MAX_OUT: `Error, Maximum OTP attempted, Please genrate new OTP`,
  INVALID_OTP_INFO: `Error, Invaild OTP INFO provide to function`,
  RESEND_OTP_SUCCESS: `Sucess, OTP has been regenerated `,
};

export const CHANGEPASSWORD = {
  USER_NOT_FOUND: `Error, User Not found in database`,
  PASSWORD_MISMATCH: `Error, Invalid Current password`,
  PASSWORD_CHANGED: `Success, Password change sucessfully`,
};

export const CHANGEEMAIL = {
  USER_NOT_FOUND: `Error, User Not found in database`,
  EMAIL_NEW_OLD_SAME: `Error, Old Email and New Email is same`,
  OTP_SENT_SUCCESS: `Success, OTP sent to new email address`,
  NO_OTP: `Error, No OTP Found which is in PENDING, TYPE: EMAIL purpose: CHANGE-EMAIL `,
  MAX_OUT: `Error, Maximum OTP attempted, Please genrate new OTP`,
  INVAILD_OTP: `Error, Invalid OTP`,
  EXPIRED_OTP: `Error, OTP has expired`,
};

export const PASSWORD = {
  UPDATED_SUCCESSFULLY: `Success, Password updated successfully.`,
};

export const CHANGE_PHONE = {
  USER_NOT_FOUND: `Error, User Not found in database`,
  PHONE_NEW_OLD_SAME: `Error, Old Phone Number and New Phone Number is same`,
  OTP_SENT_SUCCESS: `Success, OTP sent to new email address`,
  NO_OTP: `Error, No OTP Found which is in PENDING, TYPE: EMAIL purpose: CHANGE-EMAIL `,
  MAX_OUT: `Error, Maximum OTP attempted, Please genrate new OTP`,
  INVAILD_OTP: `Error, Invalid OTP`,
  EXPIRED_OTP: `Error, OTP has expired`,
};

export const TEAMMESSAGE = {
  TEAM_CREATED: `Team created successfully`,
  TEAMS_FOUND: `Teams Found`,
  TEAM_FOUND: `Team Found`,
};

export const TEAMUSER_MESSAGE = {
  TEAM_MEMBER_CREATED: `Team Member created successfully`,
  TEAM_MEMBER_DELETED: `Team Member Deleted successfully`,
  TEAM_MEMBER_UPDATED: `Team Member Updated successfully`,
  TEAM_MEMBER_FOUND: `Team Member Found`,
};
export const DEV_APIS = {
  LOGIN: `http://localhost:8001/api/user/auth/login`,
  SIGNUP: `http://localhost:8001/api/user/auth/register`,
};

export const PROD_APIS = {
  LOGIN: `http://localhost:8001/api/user/auth/login`,
  SIGNUP: `http://localhost:8001/api/user/auth/register`,
};

export const maxFileSize = 1024 * 1024 * 2;
export const maxScanFileSize = 1024 * 1024 * 2;
export const REGISTER = {
  LOGIN_TYPE_EMAIL: "EMAIL",
  LOGIN_TYPE_PHONE_NUMBER: "PHONE",
};

export const defaultProfileURL = "";
