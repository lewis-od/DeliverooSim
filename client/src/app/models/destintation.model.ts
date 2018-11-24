interface Destination {
  type: 'Restaurant' | 'Residence';
  restaurant?: Restaurant;
  residence?: Residence;

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
