# Get a list of all phonebook entries (step 1)
http :3001/api/persons

# Get number of entries and date of response (step 2)
http :3001/info

# Get a single entry by id (step 3)
http :3001/api/persons/2

# Attempt to get an entry when id is not present (step 3)
http :3001/api/persons/not_an_id

# Add an entry
http POST :3001/api/persons name='Barbara Liskov' number='1234'

# Attempt to add an entry with no name
http POST :3001/api/persons number='5432'

# Attempt to add an entry with no number
http POST :3001/api/persons name='Robert Martin'

# Attempt to add an entry with an existing name
http POST :3001/api/persons name='Ada Lovelace' number='123'

# Delete an entry
http DELETE :3001/api/persons/2
