def generate_combinations(flights, hotels):
    combinations = []

    for flight in flights:
        for hotel in hotels:
            total_price = flight["price"] + hotel["price"]

            combinations.append({
                "flight": flight,
                "hotel": hotel,
                "total_price": total_price
            })

    return combinations[:50]  # Cap it
