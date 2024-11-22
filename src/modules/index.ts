import { useThemeConfig } from "@/@core/composable/useThemeConfig";
import Swal from "sweetalert2";
import { user_role_options } from "./options";

export function errorMessage(err: any): string {
  const message =
    err &&
    "response" in err &&
    "data" in err.response &&
    err.response.data.detail
      ? err.response.data.detail.message || "Terjadi Kesalahan Pada Aplikasi"
      : "Terjadi Kesalahan Pada Aplikasi";
  return message;
}
export function kmbtFormatter(number: number) {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(1).replace(/\.0$/, "") + "tr";
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(1).replace(/\.0$/, "") + "my";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1).replace(/\.0$/, "") + "jt";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "rb";
  } else {
    return number.toString();
  }
}
export function thousandSeparator(number: number): string {
  if (isNaN(number)) {
    return number.toString();
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export function numberItemListFormatter(
  index: number,
  page: number,
  item: number
) {
  const num_value = (page - 1) * item + 1;
  return thousandSeparator(num_value + index);
}
export function dataCountFormatter(
  page: number,
  item: number,
  count: number,
  showed: number
): string {
  if (showed > 0) {
    const value = item * page;
    return `${thousandSeparator((page - 1) * item + 1)} - ${
      value <= count ? thousandSeparator(value) : thousandSeparator(count)
    } dari ${thousandSeparator(count)} Data`;
  }
  return "0 - 0 dari 0 Data";
}
export function setPaginationLength(item: number, data_length: number): number {
  if (data_length == 0) {
    return 1;
  }
  return Math.ceil(data_length / item);
}
export async function confirmAction(
  title: string = "Simpan Perubahan?",
  subtitle: string = "Perubahan data akan disimpan",
  button_text: string = "Ya, Simpan!"
): Promise<boolean> {
  const { theme } = useThemeConfig();
  try {
    const result = await Swal.fire({
      title: `${title}`,
      html: `${subtitle}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `${button_text}`,
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        title: "fs-26",
        icon: "icon-sweetalert-question",
        popup: `popup-sweetalert ${
          theme.value === "dark" ? "popup-sweetalert-dark" : ""
        }`,
        confirmButton: "btn-sweetalert btn-sweetalert-success",
        cancelButton: "btn-sweetalert btn-sweetalert-error",
      },
    });

    if (result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
export function showActionResult(
  is_center: boolean = true,
  type: any = "success",
  title: string = "Data Telah Disimpan!",
  timer: number = 1200,
  show_confirm_button: boolean = false
) {
  const { theme } = useThemeConfig();
  if (is_center) {
    Swal.fire({
      title: `${type === "error" ? "Gagal!" : "Berhasil!"}`,
      text: title,
      icon: type,
      timer: timer,
      showConfirmButton: show_confirm_button,
      customClass: {
        title: "fs-22",
        popup: `popup-sweetalert ${
          theme.value === "dark" ? "popup-sweetalert-dark" : ""
        }`,
        confirmButton: "btn-sweetalert btn-sweetalert-success",
        cancelButton: "btn-sweetalert btn-sweetalert-error",
      },
    });
  } else {
    Swal.fire({
      position: "top-end",
      icon: type,
      toast: true,
      title: `${type === "error" ? "Gagal!" : "Berhasil!"} ${title}`,
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        title: "fs-14",
        icon: "fs-14",
        popup: `popup-sweetalert ${
          theme.value === "dark" ? "popup-sweetalert-dark" : ""
        }`,
      },
    });
  }
}
export function genderFormatter(gender: string) {
  if (gender.toLocaleLowerCase() === "l") {
    return "Laki-laki";
  } else {
    return "Perempuan";
  }
}
export const roleFormatter = (role: number) => {
  const role_options = user_role_options;
  const current_data = role_options.find((el: any) => el.value == role);
  if (current_data) {
    return {
      type: current_data.title,
      color: current_data.value === 1 ? "primary" : "warning",
    };
  } else {
    return {
      type: "Member",
      color: "dark",
    };
  }
};
export const stringCutter = (text: string, substring: number) => {
  if (text) {
    if (text.length <= substring) {
      return text;
    }
    return text.substring(0, substring) + "...";
  }
  return " ";
};
