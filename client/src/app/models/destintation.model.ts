interface Destination {
  type: 'Restaurant' | 'Residence';
  restaurant?: Restaurant;
  residence?: Residence;
  loading: boolean;
}

interface Restaurant {
  location: MapLocation;
  image: string;
  name: string;
}

interface Residence {
  location: MapLocation;
  address: string;
}

