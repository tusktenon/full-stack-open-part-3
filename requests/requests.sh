# Get a list of all phonebook entries (step 1)
http :3001/api/persons

# Get number of entries and date of response (step 2)
http :3001/info

# Get a single entry by id (step 3)
http :3001/api/persons/2

# Attempt to get an entry when id is not present (step 3)
http :3001/api/persons/not_an_id
