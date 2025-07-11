export interface IObjectKeys {
  [key: string]: any;
}
export interface IUsers {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  status: number;
  gender: string;
  saldo: number;
  role: string;
  address: string;
}
export interface ICustomers {
  _id: string;
  name: string;
  service_number: string;
  package_items: string;
}
