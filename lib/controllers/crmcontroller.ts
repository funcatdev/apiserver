import * as mongoose from 'mongoose';
import {ContactSchema} from '../models/crmModel';
import {Request,Response} from 'express';

const Contact = mongoose.model('contact',ContactSchema);
export class ContactController{
    /**
     * AddNewContact
     */
    public AddNewContact(req:Request,res:Response) {
        let newContact = new Contact(req.body);

        newContact.save((err,contact)=>{
            if(err){
                res.status(500).send({
                    status:'failed',
                    message:err
                })
            }
            res.json(contact);
        })
    }

    /**
     * GetAllContacts
     */
    public GetAllContacts(req:Request,res:Response) {
        Contact.find({},(err,contact)=>{
            if(err){
                res.status(500).send({
                    status:'failed',
                    message:err
                })
            }
            res.json(contact)
        })
    }

    /**
     * GetContactFromID
     */
    public GetContactFromID(req:Request,res:Response) {
        Contact.findOne({_id:req.params.contactId},(err,contact)=>{
            if(err){
                res.status(500).send({
                    status:'failed',
                    message:err
                })
            }
            res.json(contact)
        })
    }

    /**
     * UpdateContact
     */
    public UpdateContact(req:Request,res:Response) {
        Contact.findOneAndUpdate({_id:req.params.contactId},req.body,{new:true},(err,contact)=>{
            if(err){
                res.status(500).send({
                    status:'failed',
                    message:err
                })
            }
            res.json(contact)
        })
    }

    /**
     * DeleteContact
     */
    public DeleteContact(req:Request,res:Response) {
        Contact.findOneAndDelete({_id:req.params.contactId},(err,contact)=>{
            if(err){
                res.status(500).send({
                    status:'failed',
                    message:err
                })
            }
            res.json({message: 'Successfully deleted contact!'})
        })
    }
}