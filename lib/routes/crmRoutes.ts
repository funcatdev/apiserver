import {Response,Request,Application} from 'express';
import {ContactController} from '../controllers/crmcontroller'

export class Routes{
    /**
     * route
     */
    public contactController:ContactController = new ContactController();


    public routes(app:Application):void {
        app.route('/api/v1')
            .get((req:Request,res:Response)=>{
                res.status(200).send({
                    message:'Get request ok!'
                })
            })
        
        app.route('/api/v1/contacts')
            .get(this.contactController.GetAllContacts)
           

        // one detail
        app.route('/api/v1/contact/:contactId')
            .get(this.contactController.GetContactFromID)
            .put(this.contactController.UpdateContact)
            .delete(this.contactController.DeleteContact)

        // 添加用户
        app.route('/api/v1/contact')
            .get(this.contactController.getVerificyCodeFromPhone)
            .post(this.contactController.AddNewContact)

        // VerifyCode
        app.route('/api/v1/verifycode')
            .post(this.contactController.verifyCode)
    }
}