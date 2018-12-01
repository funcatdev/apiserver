import {Response,Request,Application} from 'express';
import {ContactController} from '../controllers/crmcontroller'

export class Routes{
    /**
     * route
     */
    public contactController:ContactController = new ContactController();


    public routes(app:Application):void {
        app.route('/')
            .get((req:Request,res:Response)=>{
                res.status(200).send({
                    message:'Get request ok!'
                })
            })
        
        app.route('/contact')
            .get(this.contactController.GetAllContacts)
            .post(this.contactController.AddNewContact)

        // one detail
        app.route('/contact/:contactId')
            .get(this.contactController.GetContactFromID)
            .put(this.contactController.UpdateContact)
            .delete(this.contactController.DeleteContact)

        
    }
}