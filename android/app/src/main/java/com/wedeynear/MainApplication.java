package com.wedeynear;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.storage.ReactNativeFirebaseStoragePackage;
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativepagerview.PagerViewPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.vydia.RNUploader.UploaderReactPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import com.arttitude360.reactnative.rnpaystack.RNPaystackPackage;
import com.reactnativedocumentpicker.DocumentPickerPackage;
import com.brentvatne.react.ReactVideoPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import li.chuangbo.multishare.MultiSharePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import me.furtado.smsretriever.RNSmsRetrieverPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.rnbiometrics.ReactNativeBiometricsPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import com.reactnativecommunity.picker.RNCPickerPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.wedeynear.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
