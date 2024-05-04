const endpoints = {
  logout: "/logout",
  login: "/auth/login",
  signup: "/auth/register",
  forgot: "/auth/forgot",
  deleteUser: "/account/delete",

  profile: "/profile",
  profilePicture: "/profile/picture",

  recents: "/event/recents",
  popular: "/favorites/popular",
  group: "/favorites/group",
  allEvents: "/events",
  getEvent: "/events/",

  payTicket: "/payTicket",
  tickets: "/tickets",

  addToFavorite: "/favorites/add",
  removeToFavorite: "/favorites/remove",
  favoriteList: "/favorites/list",
};

export default endpoints;
