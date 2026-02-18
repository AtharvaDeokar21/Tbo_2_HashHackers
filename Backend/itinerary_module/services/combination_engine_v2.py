def filter_flights(flights):
    sorted_by_price = sorted(flights, key=lambda x: x["price"])
    cheapest = sorted_by_price[:5]

    sorted_by_duration = sorted(flights, key=lambda x: x.get("duration", 99999))
    fastest = sorted_by_duration[:5]

    return list({f["price"]: f for f in cheapest + fastest}.values())


def filter_hotels(hotels):
    hotels = [h for h in hotels if h.get("price")]
    sorted_by_value = sorted(hotels, key=lambda x: (x["rating"] / x["price"]) if x["price"] else 0, reverse=True)
    return sorted_by_value[:10]


def generate_combinations_v2(flights, hotels, budget):

    filtered_flights = filter_flights(flights)
    filtered_hotels = filter_hotels(hotels)

    combinations = []

    for flight in filtered_flights:
        for hotel in filtered_hotels:

            total_price = flight["price"] + hotel["price"]

            # if total_price > budget * 1.2:
            #     continue

            combinations.append({
                "flight": flight,
                "hotel": hotel,
                "total_price": total_price
            })

    return combinations
