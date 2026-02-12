/**
 * AdonisJS Error Translator - Translates backend validation errors to Indonesian
 */

export interface ValidationError {
  field: string;
  message: string;
  rule: string;
}

const adonisErrorTranslations: Record<string, Record<string, string>> = {
  // Generic patterns for AdonisJS validation rules
  database: {
    "unique|The unique constraint": "sudah terdaftar atau digunakan sebelumnya",
  },
  string: {
    "required|The required validation": "wajib diisi",
    "email|The email validation": "harus berupa email yang valid",
    "min|The min validation": "minimal harus",
    "max|The max validation": "tidak boleh lebih dari",
  },
  number: {
    "required|The required validation": "wajib diisi",
    "min|The min validation": "minimal harus",
    "max|The max validation": "tidak boleh lebih dari",
  },
  array: {
    "required|The required validation": "wajib diisi",
    "minLength|The minLength validation": "minimal harus",
    "maxLength|The maxLength validation": "tidak boleh lebih dari",
  },
};

const commonTranslations: Record<string, string> = {
  // AdonisJS Common messages
  "has already been taken": "sudah terdaftar atau digunakan sebelumnya",
  "field is required": "wajib diisi",
  "must be a valid email": "harus berupa email yang valid",
  "must be at least": "minimal harus",
  "must not be more than": "tidak boleh lebih dari",
  "is required": "wajib diisi",
  "is invalid": "tidak valid",

  // Specific field patterns for detection
  "username": "Username",
  "password": "Password",
  "email": "Email",
};

/**
 * Translate AdonisJS validation error message to Indonesian
 * @param message - Error message from backend
 * @param rule - Validation rule that failed (e.g., 'database.unique')
 * @returns Translated message in Indonesian
 */
export const translateAdonisError = (
  message: string,
  rule: string = ""
): string => {
  // Try exact match first
  if (commonTranslations[message]) {
    return commonTranslations[message];
  }

  // Try pattern matching
  for (const [key, value] of Object.entries(commonTranslations)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Handle rule-based translations
  if (rule) {
    const [ruleType, ruleName] = rule.split(".");
    if (adonisErrorTranslations[ruleType]) {
      const ruleTranslations = adonisErrorTranslations[ruleType];
      for (const [key, value] of Object.entries(ruleTranslations)) {
        if (
          message.toLowerCase().includes(key.toLowerCase()) ||
          rule.includes(ruleName)
        ) {
          return value;
        }
      }
    }
  }

  // Default: return original message if no translation found
  return message;
};

/**
 * Translate field name to Indonesian
 * @param fieldName - Field name from backend error
 * @returns Translated field name in Indonesian
 */
export const translateFieldName = (fieldName: string): string => {
  const fieldTranslations: Record<string, string> = {
    // Teacher account fields
    fullName: "Nama Lengkap",
    username: "Username",
    password: "Password",
    schoolLessonIds: "Mata Pelajaran",
    photoUrl: "Foto Profil",

    // Student fields
    "studentDetail.fullName": "Nama Lengkap",
    "studentDetail.nisn": "NISN",
    "studentDetail.nik": "NIK",
    "studentDetail.dateOfBirth": "Tanggal Lahir",
    "studentDetail.gender": "Jenis Kelamin",
    "studentDetail.religion": "Agama",
    "studentDetail.email": "Email",
    "studentDetail.phoneNumber": "Nomor Telepon",
    "studentDetail.address": "Alamat",

    // Parent fields
    "parentDetail.fatherName": "Nama Ayah",
    "parentDetail.motherName": "Nama Ibu",
    "parentDetail.guardianName": "Nama Wali",
    "parentDetail.fatherLivingStatus": "Kondisi Ayah",
    "parentDetail.motherLivingStatus": "Kondisi Ibu",
    "parentDetail.parentPhoneNumber": "Nomor Telepon Orang Tua",
    "parentDetail.parentAddress": "Alamat Orang Tua",
  };

  return fieldTranslations[fieldName] || fieldName;
};

/**
 * Transform validation errors from AdonisJS backend to client format
 * @param errors - Array of error objects from backend
 * @returns Transformed validation errors with translated messages
 */
export const transformAdonisValidationErrors = (
  errors: ValidationError[]
): ValidationError[] => {
  return errors.map((error) => ({
    field: error.field,
    message: translateAdonisError(error.message, error.rule),
    rule: error.rule,
  }));
};
