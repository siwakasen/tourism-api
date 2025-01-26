export class bookingToOwnerDto {
  public readonly package_name: string;
  public readonly name: string;
  public readonly email: string;
  public readonly country_of_origin: string;
  public readonly phone_number: string;
  public readonly number_of_adults: number;
  public readonly number_of_children: number;
  public readonly start_date: string;
  public readonly pickup_location: string;
  public readonly pickup_time: string;
  public readonly additional_condition: string;
}

export class bookingToCustomerDto {
  public readonly package_name: string;
  public readonly email: string;
}
