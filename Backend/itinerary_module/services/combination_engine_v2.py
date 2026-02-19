def filter_flights(flights):
    sorted_by_price = sorted(flights, key=lambda x: x.get("price", 999999))
    cheapest = sorted_by_price[:5]

    sorted_by_duration = sorted(flights, key=lambda x: x.get("duration", 99999))
    fastest = sorted_by_duration[:5]

    # Remove duplicates by airline + price
    unique = {}
    for f in cheapest + fastest:
        key = (f.get("airline"), f.get("price"))
        unique[key] = f

    return list(unique.values())


def filter_hotels(hotels):

    def extract_price(h):
        return (
            h.get("total_price") or
            h.get("price_per_night") or
            0
        )

    hotels = [h for h in hotels if extract_price(h) > 0]

    sorted_by_value = sorted(
        hotels,
        key=lambda x: (
            (x.get("rating", 0) / extract_price(x))
            if extract_price(x) else 0
        ),
        reverse=True
    )

    return sorted_by_value[:10]


def generate_combinations_v2(flights, hotels, budget):

    filtered_flights = filter_flights(flights)
    filtered_hotels = filter_hotels(hotels)

    combinations = []

    for flight in filtered_flights:
        for hotel in filtered_hotels:

            hotel_price = (
                hotel.get("total_price") or
                hotel.get("price_per_night") or
                0
            )

            flight_price = flight.get("price", 0)

            total_price = flight_price + hotel_price

            combinations.append({
                "flight": flight,
                "hotel": hotel,
                "total_price": total_price
            })

    print("COMBINATIONS GENERATED:", len(combinations))

    return combinations
