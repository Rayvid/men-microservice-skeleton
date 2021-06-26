# Purpose of this folder

Model generally is about describing all bussiness oriented logic, including all data access you do to achieve your bussiness goals. So usually this folder is quite unique for each microservice.

We do demonstrate access to data using mongoose as ORM there. Its up to you how to convert mongoose schemas into actual repositories/models, current approach is provided as an example, to demonstrate how mongoose schemas could potentially be mapped into actual "bussiness language".

Side notes
- It's always good practice to keep all write operations in single place. If you will spread write logic into diff code places or, even worse, diff code bases - that would become maintainance headache quite soon
- Throw (promose) or callback returning Error? We do prefer throw across this codebase, because exception wrapping, bubbling field error and better maintainability/consistency, just do not use throw instead return - throw is for exceptional situations (not occuring during normal operation)
