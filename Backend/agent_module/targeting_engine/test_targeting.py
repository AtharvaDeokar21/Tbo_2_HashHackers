from targeting_service import get_top_targets

destination = "Bali"

targets = get_top_targets(destination)

print(f"\nTop Targets for {destination}:\n")

for t in targets[:10]:
    print(t)
