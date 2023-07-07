export const actionType = {
SET_USERS_ITEMS:"SET_USERS_ITEMS",
SET_OFFICES_ITEMS:"SET_CATEGORIE_ITEMS",
SET_MAIL_ITEMS:"SET_MAIL_ITEMS",
SET_TEAM_ITEMS:"SET_TEAM_ITEMS"
}

const reducer = (state,action) =>{
   switch(action.type)
   {

        case actionType.SET_USERS_ITEMS:
            return {
                ...state,
                users:action.users
            }
        case actionType.SET_MAIL_ITEMS:
            return {
                ...state,
                team:action.team
            }
        case actionType.SET_OFFICES_ITEMS:
            return {
                ...state,
                offices:actionType.SET_OFFICES_ITEMS
            }
        case actionType.SET_MAIL_ITEMS:
            return {
                ...state,
                mails:action.mails             
            }
       default:
           return state
   } 

}

export default reducer
