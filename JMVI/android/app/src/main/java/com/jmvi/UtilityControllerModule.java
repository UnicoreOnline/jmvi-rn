package com.jmvi;


import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;

//import com.junobaby.fcm.SendNotificationTask;

//import static com.facebook.accountkit.internal.AccountKitController.getApplicationContext;

public class UtilityControllerModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public UtilityControllerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "UtilityController";
    }


//    @ReactMethod
//    public void call(String mobilenumber) {
//        try {
//            Intent intent = new Intent(Intent.ACTION_CALL);
//
//            intent.setData(Uri.parse("tel:" + mobilenumber));
//            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//            reactContext.startActivity(intent);
//
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            //callback.invoke("error");
//        }
//    }

    @ReactMethod
    public void sendSMS(ReadableMap options, Callback callback) {

        try {
            ReadableArray a = options.getArray("recipients");


            TelephonyManager telMgr = (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
            int simState = telMgr.getSimState();
            if (simState == TelephonyManager.SIM_STATE_ABSENT) {
                callback.invoke("No SIM Available");

            } else {
//                android.telephony.SmsManager mSmsManager = android.telephony.SmsManager.getDefault();
//                mSmsManager.sendTextMessage(a.getString(0), null, options.getString("textMessage"), null, null);


                android.telephony.SmsManager mSmsManager = android.telephony.SmsManager.getDefault();
                ArrayList<String> parts = mSmsManager.divideMessage(options.getString("textMessage"));
                mSmsManager.sendMultipartTextMessage(a.getString(0), null, parts, null, null);
//                mSmsManager.sendTextMessage(a.getString(0), null, options.getString("textMessage"), null, null);

                callback.invoke("success");
                Log.e("message sent", "yes");
            }


        } catch (Exception ex) {
            Log.e("message sent", "fail");
            callback.invoke("error");
            ex.printStackTrace();
        }
    }

    @ReactMethod
    public void openMessenger(ReadableMap options) {
        Intent sendIntent = new Intent(Intent.ACTION_SENDTO);
        sendIntent.setData(Uri.parse("sms:" + options.getString("phone")));
        String text = options.getString("textMessage");
        sendIntent.putExtra(Intent.EXTRA_TEXT, text);
        sendIntent.putExtra("sms_body", text);
//        sendIntent.putExtra("exit_on_sent", true);
//        sendIntent.putExtra("finishActivityOnSaveCompleted", true);
        sendIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(sendIntent);
    }

    @ReactMethod
    public void shareApp(String accessId) {
        //final String[] body = {"Download my App, Everything you need to know! Your access ID is" + " " + accessId + "\n" + Uri.parse("https://play.google.com/store/apps/details?id=" + getApplicationContext().getPackageName())};

        final String[] body = {accessId + "\n" + Uri.parse("https://play.google.com/store/apps/details?id=" + reactContext.getApplicationContext().getPackageName())};
        final Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("text/plain");
        share.putExtra(Intent.EXTRA_SUBJECT, reactContext.getString(R.string.app_name));
        share.putExtra(Intent.EXTRA_TEXT, body[0]);
        share.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        share.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(outputFile));
        if (getCurrentActivity() != null)
            getCurrentActivity().startActivity(share);
    }

    @ReactMethod
    public void shareRefLink(String link) {
        final String[] body = {link};
        final Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("text/plain");
        share.putExtra(Intent.EXTRA_SUBJECT, reactContext.getString(R.string.app_name));
        share.putExtra(Intent.EXTRA_TEXT, body[0]);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            share.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        }
//        share.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(outputFile));
        // reactContext.startActivity(share);
        if (getCurrentActivity() != null)
            getCurrentActivity().startActivity(Intent.createChooser(share, "Share via"));
    }

    @ReactMethod
    public void encrypt(String text, Callback callback) {
        String returnEncryptedText = "";
        Crypto crypto = new Crypto();
        try {
            returnEncryptedText = crypto.bytesToHex(crypto.encrypts(text.trim()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        callback.invoke(returnEncryptedText);
    }

    @ReactMethod
    public void dycrypt(String text, Callback callback) {
        String returnDecryptedText = "";
        Crypto crypto = new Crypto();
        try {
            returnDecryptedText = new String(crypto.decrypts(text.trim()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        callback.invoke(returnDecryptedText);
    }


    @ReactMethod
    public void clearAllNotification() {
        NotificationManager notificationManager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
        assert notificationManager != null;
        notificationManager.cancelAll();
    }

//    @ReactMethod
//    public void callFromReactNative(boolean isFromInbox) {
//        Log.e("isFromInbox>>> ", isFromInbox+"");
//        SendNotificationTask.isFromInbox = isFromInbox;
//    }

}
