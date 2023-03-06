export type SignUpForm = {
  username: string;
  email: string;
  password: string;
}

export type SignInForm = {
  username_or_email: string;
  password: string;
}

export type UserTokens = {
  access_token: null | string;
  refresh_token: null | string;
}

export type Category = {
  id: number;
  name: string;
}

export type Chapter = {
  id: number;
  name: string;
  images: Array<{url: string}>;
  free: boolean;
}

export type Comic = {
  id: number;
  name: string;
  other_names: string;
  author: string;
  description: string;
  views: number;
  likes: number;
  image: string;
  status: string;
  liked: boolean;
  categories?: Array<Category>;
  chapters?: Array<Chapter>
}

export type User = {
  avatar_url?: string;
  firstname: string;
  lastname: string;
  birthday: Date;
  username: string;
  email: string;
  current_plan?: Purchase;
}

export type Plan = {
  id: number;
  name: string;
  description: string;
  price: number;
  value: number;
}

export type PaymentMethod = {
  key: string;
  name: string;
}

export type Purchase = {
  id: number;
  plan: Plan;
  price: number;
  effective_date: Date;
  expiry_date: Date;
  payment_method: string;
}

export type Notification = {
  id: number;
  message: {
    title: string;
    body: string;
    data?: any;
  },
  seen: boolean;
  created_at: Date;
}
