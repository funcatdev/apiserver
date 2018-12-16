import * as mongoose from 'mongoose';
import { ContactSchema } from '../models/crmModel';
import { Request, Response } from 'express';
import * as SMSClient from '@alicloud/sms-sdk';
import {config} from '../../config';

const Contact = mongoose.model('contact', ContactSchema);
export class ContactController {


    /**
     * verifyCode
     */
    public verifyCode(req:Request,res:Response) {
        
        let phoneNum = req.body.phoneNum;
        let checkCode = req.body.checkCode;

        Contact.findOne({phoneNum:phoneNum,checkCode:checkCode},((err,contact)=>{
            if(err){
                res.status(500).send({
                    status:false,
                    msg:err
                })
            }else{
                if(contact!=null){
                    res.json(contact);
                }else{
                    res.status(201).send({
                        status:false,
                        msg:'没有找到此用户'
                    })
                }
                
            }
        }))

    }

    /**
     * AddNewContact
     */
    public AddNewContact(req: Request, res: Response) {
        let newContact = new Contact(req.body);
        let phoneNum = req.body.phoneNum;

        const accessKeyId = config.accessKeyId;
        const secretAccessKey = config.secretAccessKey;

        let smsClient = new SMSClient({ accessKeyId, secretAccessKey })

        //检查电话号码是否正确
        let regx = /^(13|15|17|18|14)[0-9]{9}$/;
        if (!phoneNum || !regx.exec(phoneNum)) return res.status(400).json({ status: 'failed', msg: "phone num error" });
        //生成4位数字的随机数
        let code = Math.floor(Math.random() * (9999 - 999 + 1) + 999);

        //检查用户是否已经注册

        Contact.findOne({ phoneNum: phoneNum }, (err, contact) => {
            if (err) {
                res.status(500).send({
                    status: 'failed',
                    message: err
                })
            } else {
                //如果用户不存在 将用户保存到数据库
                if (contact == null) {
                    newContact.save((err, contact) => {
                        if (err) {
                            res.status(500).send({
                                status: 'failed',
                                message: err
                            })
                        }else{
                            console.log("setupPhoneNum",phoneNum)
                            smsClient.sendSMS({
                                PhoneNumbers: "17081371097",//必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
                                SignName: config.SignName , //必填:短信签名-可在短信控制台中找到
                                TemplateCode: config.TemplateParam,//必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
                                TemplateParam: `{"code":${code}}` //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时。
                            }).then(function (r) {
                                let {Code}=r
                                console.log("R========",r);
                                if (Code === 'OK') {
                                    //处理返回参数
                                    Contact.findOneAndUpdate({phoneNum:phoneNum},{checkCode:code},(err,doc,res)=>{
                                        
                                        if(err){
                                            res.status(500).json({
                                                status: 'failed',
                                                message: err
                                            })
                                        }
                                    })
                                }
                            })

                            res.json(contact);
                        }
                    })
                    // 用户已经存在 提示用户已经注册
                } else {
                    res.status(400).send({
                        status:'failed',
                        message:'用户已经注册！'
                    })
                }
            }

        })

      
    }

    /**
     * GetAllContacts
     */
    public GetAllContacts(req: Request, res: Response) {
        Contact.find({}, (err, contact) => {
            if (err) {
                res.status(500).send({
                    status: 'failed',
                    message: err
                })
            }
            res.json(contact)
        })
    }

    /**
     * GetContactFromID
     */
    public GetContactFromID(req: Request, res: Response) {
        Contact.findOne({ _id: req.params.contactId }, (err, contact) => {
            if (err) {
                res.status(500).send({
                    status: 'failed',
                    message: err
                })
            }
            res.json(contact)
        })
    }

    /**
     * 从手机号查找验证码
     */
    public getVerificyCodeFromPhone(req:Request,res:Response) {
        Contact.findOne({phoneNum:req.query.phoneNum},(err,contact)=>{
            if (err) {
                res.status(500).send({
                    status: 'failed',
                    message: err
                })
            }
            res.json(contact)
        })
    }

    /**
     * UpdateContact
     */
    public UpdateContact(req: Request, res: Response) {
        Contact.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, contact) => {
            if (err) {
                res.status(500).send({
                    status: 'failed',
                    message: err
                })
            }
            res.json(contact)
        })
    }

    /**
     * DeleteContact
     */
    public DeleteContact(req: Request, res: Response) {
        Contact.findOneAndDelete({ _id: req.params.contactId }, (err, contact) => {
            if (err) {
                res.status(500).send({
                    status: 'failed',
                    message: err
                })
            }
            res.json({ message: 'Successfully deleted contact!' })
        })
    }
}