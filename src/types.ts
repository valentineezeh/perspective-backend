type Body = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  postcode: string;
}

type Query = {
  created: string
}

export {
  Body,
  Query
}