import type { ServiceTime } from "./types";

export const church = {
  name: "Fellowship Missionary Baptist Church of Chicago",
  shortName: "Fellowship Chicago",
  nickname: "The Ship",
  founded: 1950,
  founder: "Rev. Dr. Clay Evans",
  seniorPastor: "Reginald W. Sharpe Jr.",
  address: {
    street: "4543 S Princeton Ave",
    city: "Chicago",
    state: "IL",
    zip: "60609",
  },
  phone: "(773) 924-3232",
  phoneHref: "tel:+17739243232",
  email: undefined as string | undefined, // TODO: church to supply a public inbox
  officeHours: "Tuesday–Friday, 9:00 AM–5:00 PM",
  url: "https://fellowshipchicago.com",
  vision: "Share the Gospel through acts of love and generosity.",
  hashtag: "#TheVirtualShip",
} as const;

export const fullAddress = `${church.address.street}, ${church.address.city}, ${church.address.state} ${church.address.zip}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

export const serviceTimes: ServiceTime[] = [
  { id: "sun-8", label: "Early Worship", day: "Sunday", time: "08:00", display: "8:00 AM" },
  {
    id: "sun-1045",
    label: "Worship + Kidz Zone & Youth",
    day: "Sunday",
    time: "10:45",
    display: "10:45 AM",
    note: "Kidz Zone and youth meet during this service.",
  },
  {
    id: "sun-115",
    label: "Afternoon Worship",
    day: "Sunday",
    time: "13:15",
    display: "1:15 PM",
    todo: "Current site lists this service as both 1:00 PM and 1:15 PM. Confirm.",
  },
  {
    id: "tue-refuel",
    label: "Refuel Midweek",
    day: "Tuesday",
    time: "19:00",
    display: "7:00 PM",
    seasonal: true,
    note: "Seasonal midweek service.",
  },
];

export const youtube = {
  channelId: "UCbc_LGxLxkKMdfzm54HMEGg",
  channelUrl: "https://www.youtube.com/channel/UCbc_LGxLxkKMdfzm54HMEGg",
  /** Uploads playlist = channel id with UC -> UU. Lets us embed without a known video id. */
  uploadsPlaylist: "UUbc_LGxLxkKMdfzm54HMEGg",
  liveEmbed: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCbc_LGxLxkKMdfzm54HMEGg",
  rss: "https://www.youtube.com/feeds/videos.xml?channel_id=UCbc_LGxLxkKMdfzm54HMEGg",
};

export const social = {
  facebook: "https://www.facebook.com/FellowshipChicago",
  instagram: "https://www.instagram.com/fellowshipchicago",
  youtube: youtube.channelUrl,
};

export const giving = {
  primary: {
    label: "Give with ShelbyGiving",
    url: "https://shelbygiving.com/app/Giving/fell4543118",
  },
  cashApp: { handle: "$FellowshipChicago", url: "https://cash.app/$FellowshipChicago" },
  zelle: { recipient: undefined as string | undefined }, // TODO: Zelle email/phone
  textToGive: { number: undefined as string | undefined, keyword: undefined as string | undefined }, // TODO
  paypal: { url: undefined as string | undefined }, // TODO: PayPal link
  mail: {
    payableTo: "Fellowship Missionary Baptist Church", // TODO: confirm payee name
    address: "4543 S Princeton Ave, Chicago, IL 60609",
  },
};
