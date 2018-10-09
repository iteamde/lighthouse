export interface Menu {
  name: string;
  link: string;
  order: number;
}

export interface Item {
  product: Product;
  quantity: number;
  content: string;
}

export class ProjectCartItem {
  constructor(public product: Product, public quantity: number) {}

  get totalPrice() {
    return this.product.price * this.quantity;
  }
}

export class ProjectCart {
  items: ProjectCartItem[];

  constructor(public itemsMap: { [productId: string]: ProjectCartItem }) {
    for (const productId in itemsMap) {
      if (productId) {
        const item = itemsMap[productId];
        this.items.push(new ProjectCartItem(item.product, item.quantity));
      }
    }
  }
}

export interface Product {
  title: string;
  id: string;
  price: number;
  category: string;
  image_url: string;
  image_info: string;
  name: string;
  slug: string;
}

export interface User {
  uid: string;
  email: string;

  currentProject?: string;

  photoURL?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;

  phoneNumber?: number;

  membershipLevel?: number;
  membershipDiscount?: number;
  membershipPoints?: number;

  addressCity?: string;
  addressCountry?: string;
  addressPostalCode?: number;
  addressState?: string;
  addressStreet1?: string;
  addressStreet2?: string;

  companyIs?: number;
  companyName?: string;
  companyPhoneNumber?: string;
  companyAddressCity?: string;
  companyAddressCountry?: string;
  companyAddressPostalCode?: number;
  companyAddressState?: string;
  companyAddressStreet1?: string;
  companyAddressStreet2?: string;

  driversLicenceExpiry?: Date;
  driversLicenceNumber?: number;
  driversLicenseState?: string;
  driversLicenseVerified?: number;

  studentIs?: number;
  studentCourseName?: string;
  studentGraduationYear?: number;
  studentIdNumber?: string;
  studentVerified?: number;
  studentSchoolName?: string;
}
