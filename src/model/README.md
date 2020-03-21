# Purpose of this folder

Model generally is about describing all bussiness oriented logic, including all data access you do to achieve your bussiness goals. So usually this folder is quite unique for each microservice.

We do demonstrate access to data using mongoose as ORM there. Its up to you how to convert mongoose schemas into actual repositories/models, current approach is only for example purpose, demonstrating how mongoose schemas could potentially be mapped into actual bussiness layer, while still retaining decoupling.

Side note - its always good practice to keep all write operations in single place. If you will spread write logic into diff code places or, even worse, diff code bases - that would become maintainance headache quite soon.
