import { isEmpty, isEmptyArray, isNullOrUndefined } from "./index";

// 👉 Required Validator
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return "Kolom ini tidak boleh kosong";

  return !!String(value).trim().length || "Kolom ini tidak boleh kosong";
};

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (Array.isArray(value))
    return (
      value.every((val) => re.test(String(val))) || "Format email tidak sesuai"
    );

  return re.test(String(value)) || "Format email tidak sesuai";
};

// 👉 Phone Number Validator
export const phoneNumberValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  // Format nomor Indonesia: dimulai dengan '62', diikuti oleh 8-13 digit angka
  const re = /^(8)\d{8,11}$/;

  if (Array.isArray(value))
    return (
      value.every((val) => re.test(String(val))) ||
      "Format nomor telepon tidak sesuai (Cth:81218xxxxx)"
    );

  return re.test(String(value)) || "Format nomor telepon tidak sesuai (Cth:81218xxxxxx)";
};

// 👉 Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;

  const validPassword = regExp.test(password);

  return (
    // eslint-disable-next-line operator-linebreak
    validPassword ||
    "Kolom ini harus mengandung huruf kapital, huruf kecil, karakter spesial dan minimal 8 karakter"
  );
};

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string) =>
  value === target || "Konfirmasi password tidak sesuai";

// 👉 Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value);

  return (
    (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) ||
    `Masukkan angka antara ${min} dan ${max}`
  );
};

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  if (Array.isArray(value))
    return (
      value.every((val) => /^-?[0-9]+$/.test(String(val))) ||
      "Kolom ini harus diisi dengan angka"
    );

  return (
    /^-?[0-9]+$/.test(String(value)) || "Kolom ini harus diisi dengan angka"
  );
};

// 👉 Regex Validator
export const regexValidator = (
  value: unknown,
  regex: RegExp | string
): string | boolean => {
  if (isEmpty(value)) return true;

  let regeX = regex;
  if (typeof regeX === "string") regeX = new RegExp(regeX);

  if (Array.isArray(value))
    return value.every((val) => regexValidator(val, regeX));

  return regeX.test(String(value)) || "Format regex tidak sesuai";
};

// 👉 Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  return (
    /^[A-Z]*$/i.test(String(value)) || "Kolom ini harus mengandung alfabet"
  );
};

// 👉 URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const re =
    /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

  return re.test(String(value)) || "Format URL tidak sesuai";
};

// 👉 Length Validator
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value)) return true;

  return (
    String(value).length === length ||
    `Kolom ini minimal memiliki ${length} huruf`
  );
};

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const valueAsString = String(value);

  return /^[0-9A-Z_-]*$/i.test(valueAsString) || "Format huruf tidak sesuai";
};
