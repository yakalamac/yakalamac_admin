/**
* This file is part of Yakalamaç Project of LevelEnd Yazılım Bilişim A.Ş.
*
* @description This file helps to developers to easly make login with different identity
* providers like `Google`, `Facebook`, `Apple` etc.
* It's just client-side running script that uses JS Client libs of providers.
* It decides how to handle login process and how to set up these client libraries
*
* @namespace Yakalamac
* @class Yakalamac
*
* @copyright LevelEnd Yazılım Bilişim Anonim Şirket
*
* @example const gip = new Yakalamac('admin');
*
* gip.createGoogleIdentityProvider(
*     '901480078814-hs3spn3kcfl5rbv6fjqn14ghjufgs1ok.apps.googleusercontent.com',
*     'https://stag-deep-internally.ngrok-free.app/identity-provider/google'
* ).getGoogleIdentityProvider().init();
*
* gip.createAppleIdentityProvider(
*     'la.yaka.api',
*     [
*         'name',
*         'email'
*     ],
*     'https://stag-deep-internally.ngrok-free.app/identity-provider/apple'
* ).getAppleIdentityProvider().init();
*
* gip.appleOnSuccess((...args)=>{
*    console.log(...args);
* });
*
* gip.appleOnSuccessOnException((...args)=>{
*     console.log(...args);
* });
*
* gip.appleOnFailure((failureResponse)=>{
*     failureResponse.text().then(text=>{
*         console.log(JSON.parse(text));
*     }).catch(e=>{
*         console.error(e);
*     });
* });
*
* gip.googleOnSuccess(event=>{
*     console.log(event)
* });
*
* gip.googleOnFailure(event=>console.error(event));
*
* gip.appleOnFailureOnException((...args)=>console.log(...args));
*
*
* @author Onur Kudret 
* @author Alper Uyanik 
* @version 1.0.0
*/

'use strict';

import { YakalamacIdentityProvider as Yakalamac } from "./src/yakala.js";

export default Yakalamac;

