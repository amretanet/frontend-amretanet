import { useThemeConfig } from "@/@core/composable/useThemeConfig";
import Swal from "sweetalert2";
import { customer_status_options, user_role_options } from "./options";
import moment from "moment";

export function dateFormatterID(
  date: string,
  month_shorted: boolean = false,
  show_time: boolean = false,
  is_plus_7: boolean = false
): string {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const new_date = is_plus_7 ? moment(date).add(7, "hours") : date;
  const _year = moment(new_date).year();
  const _month = months[moment(new_date).month()];
  const _date = moment(new_date).date().toString().padStart(2, "0");
  const formatted_date = `${_date} ${
    month_shorted ? _month.substring(0, 3) : _month
  } ${_year} ${show_time ? moment(new_date).format("HH:mm:ss") : ""}`;
  return formatted_date;
}
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
      type: "Pelanggan",
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
export const customerStatusFormatter = (status: number) => {
  const status_options = customer_status_options;
  const current_status = status_options.find((el: any) => el.value === status);
  let temp = {
    type: "",
    color: "dark",
  };
  if (status === 0) {
    temp.color = "error";
  } else if (status === 1) {
    temp.color = "success";
  } else if (status === 2) {
    temp.color = "info";
  } else if (status === 3) {
    temp.color = "primary";
  } else if (status === 4) {
    temp.color = "warning";
  } else {
    temp.color = "secondary";
  }
  if (current_status) {
    temp.type = current_status.title;
  } else {
    temp.type = "-Tidak Diketahui-";
  }
  return temp;
};
export const ticketStatusFormatter = (status: string) => {
  let temp = {
    type: "",
    color: "",
  };
  if (status == "open") {
    temp.type = "Ditugaskan";
    temp.color = "primary";
  } else if (status == "pending") {
    temp.type = "Menunggu";
    temp.color = "dark";
  } else if (status == "on_progress") {
    temp.type = "Dikerjakan";
    temp.color = "warning";
  } else if (status == "closed") {
    temp.type = "Selesai";
    temp.color = "success";
  }
  return temp;
};
export const invoiceStatusFormatter = (status: string) => {
  let temp = {
    type: "",
    color: "",
  };
  if (status == "UNPAID") {
    temp.type = "BELUM DIBAYAR";
    temp.color = "error";
  } else if (status == "PAID") {
    temp.type = "TELAH DIBAYAR";
    temp.color = "success";
  } else if (status == "PENDING") {
    temp.type = "MENUNGGU PEMBAYARAN";
    temp.color = "dark";
  } else if (status == "CONFIRM") {
    temp.type = "MENUNGGU KONFIRMASI";
    temp.color = "warning";
  }
  return temp;
};
export const getLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};
export const numberToWords = (number: number) => {
  const satuan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
  ];
  const levels = ["", "Ribu", "Juta", "Milyar", "Triliun"];

  if (number === 0) return "Nol";

  let result = "";
  let level = 0;

  while (number > 0) {
    let part = number % 1000;

    if (part !== 0) {
      let partStr = "";
      const ratusan = Math.floor(part / 100);
      const puluhanDanSatuan = part % 100;

      if (ratusan > 0) {
        partStr +=
          (ratusan === 1 ? "Seratus" : satuan[ratusan] + " Ratus") + " ";
      }

      if (puluhanDanSatuan > 0) {
        if (puluhanDanSatuan < 10) {
          partStr += satuan[puluhanDanSatuan] + " ";
        } else if (puluhanDanSatuan === 10) {
          partStr += "Sepuluh ";
        } else if (puluhanDanSatuan < 20) {
          if (puluhanDanSatuan === 11) {
            partStr += "Sebelas ";
          } else {
            partStr += satuan[puluhanDanSatuan % 10] + " Belas ";
          }
        } else {
          const puluhan = Math.floor(puluhanDanSatuan / 10);
          const satuanAngka = puluhanDanSatuan % 10;

          partStr += satuan[puluhan] + " Puluh ";
          if (satuanAngka > 0) {
            partStr += satuan[satuanAngka] + " ";
          }
        }
      }

      if (level === 1 && part === 1) {
        partStr = "Seribu ";
      } else {
        partStr += levels[level] + " ";
      }

      result = partStr + result;
    }

    level++;
    number = Math.floor(number / 1000);
  }

  return result.trim();
};
