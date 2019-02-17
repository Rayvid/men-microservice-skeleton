# Purpose of this folder

Model generally is about describing all bussiness oriented logic, including all data access you do to achieve your bussiness goals.

We do actual access to data mainly using mongoose as ORM - as demonstrated in model/schemas folder.

Its up to you how to convert mongoose schemas into actual repositories/models, - model/sportsAppRepository folder and model/index.js is only for example purpose, demonstrating how mongoose schemas could potentially be mapped into actual bussiness layer.

Side note - its always recommended to keep all write operations around one entity/entity-group in one repository. If you spread writes into diff code places or, even worse, diff code bases - that would become maintainance headache quite soon
