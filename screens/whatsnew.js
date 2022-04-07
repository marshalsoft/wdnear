import React, {PureComponent} from 'react';
import {Platform,
    StyleSheet,
    Text, 
    View,
    Clipboard,
    SafeAreaView,
    FlatList,
    ToastAndroid,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Animated,
    Easing,
    Keyboard,
    Picker,
    ActivityIndicator,
    Linking,
    TouchableWithoutFeedback,
    Dimensions,
    DatePickerAndroid,
    BackAndroid,
    Switch,
    AsyncStorage,
    ViewPagerAndroid,
    BackHandler,
    DeviceEventEmitter,
    PermissionsAndroid,
    Image,
    Slider,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
    import {WebView} from 'react-native-webview';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import * as Animatable from 'react-native-animatable';
import {returnAllNumbers,postDATA,sendEmail,postTEST} from '../includes/func';
import {DocumentPicker,DocumentPickerUtil} from "react-native-document-picker";
import Video from 'react-native-video';
import RNFetchBlob from "rn-fetch-blob";
import ReturnADS  from '../components/showADS';

class WhatsnewClass extends PureComponent{
  
    componentDidMount()
    {
        const Actions = this.props.navigation;
        this.Bk = BackHandler.addEventListener("hardwareBackPress",()=>{
            if(this.state.indexView != 0)
            {
                this.setState({indexView:0},()=>{
                    this.ScrolV.scrollTo({x:0,y:0,animated:false});
                });
                return true;
            }
            Actions.goBack();
        })
        this.getNews();
        setTimeout(()=>{
            DeviceEventEmitter.emit("ads",{});
           },6000)
     }
   
     getNews()
     {
        this.setState({loading:true});
         postDATA("news/getNews",{}).then((res)=>{
        this.setState({loading:false,newlist:[...res.result.map((a,i)=>{
         a.images = {uri:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUSEhIVFhUVFRUYFhYXFxgVGxUWFxUXFhcXFxcYHSggGBolHRcVITEhJSktLi4uFx8zODMsNyguLisBCgoKDg0OGxAQGy0lHyUtLSstLS0vLS0tLS8tLS0uLS0tLS0tLSstLSstLS0tLS0tLS0tLS0tLS0tLSstLS0tLf/AABEIAOEA4AMBEQACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAAAQIGBwMEBQj/xABDEAABAwICBwUECQIFBAMBAAABAAIDBBEFMQYHEiFBUXETImGBkTJSodEUI0JicoKSscEzslOiwuHwJENj8WR0oxX/xAAbAQEAAgMBAQAAAAAAAAAAAAAAAQIDBAUGB//EADgRAAIBAwIDBQYFAwQDAAAAAAABAgMEESExBRJBE1FhcYEGIjKRodEUscHh8EJS8RUjNHIkM2L/2gAMAwEAAhEDEQA/ALxQAgBACAEAIAQAgBACAEAIAQAgBACAEAIAQAgBACAEAIAQAgBACAEAIAQAgBACACgML5+SAwCd1888kBmbUcx6b/8AdAZWPByIKAcgBACAEAIAQAgBACAEAIAQAgBACAEAIAQAgBACAEAx7wEBrveSgNeqqWRsL5HNY0ZucbAeZUNpLLL06c6klGCy30RAcf1lxNOzTMMhBB23d1u479kZnlvtmtOd5FaR1PR2vs3VmuatLl8Fq/XoTjCMSjqYGTxm7Xi/iDkWnxBuPJbcZKSyjz1ejOjUdOe6Nst/9/7qxiHtkcON+vzCAyNqRxBHxHr80Bma4EXG8IBUAIAQAgBACAEAIAQAgBACAEAIAQAgBACAxyyW6oDXJQEX0t0zhowWC0k3CMHc3xeeHTNa9a4jT06nY4bwerePmfuw7+/yKix3H6irftTPuB7LBua3o3+c1zKlWU3mR7mzsKFpHlpL16v1OXZYzcwS7V9pZ9Dl7KZ3/TyHeT/2n5B/4TkfI8Cty1rcr5XseZ4/wztY9vTXvLfxRdQK6Z4gEAIBA3iN3Td680A9szhnZ3wPyPwQGVtS057jyO745HyQGZACAEAIAQAgBACAEAIAQAgBACAEBimktu4oDXQFead6eiPap6R135PlG8M5tZzdzPDrlo3Fzj3YfM9RwjgfaYrXC06R7/F+H5lWPeXEkkkk3JO8knMk8Vzmz2kYpLCEUFwQYEIUlWsli6uNN9gsoqp3dPdglJy5RPP9p8l07avzLle54TjXCXQk6tNe6/oWotw86IgBACACEAjRb2SR+3HgevBAPFUR7Qv4j5H5+SAzRVDXbgd/LI+iAyoAQAgBACAEAIAQAgBACAZK+wQGrdAV1rH0z7MOpKd3fO6V4+wPcafePE8OuWlc18e5E9PwThPaNXFZadF3+L8Cqwuae0Q4KC6FCFkLZQTgQqSGjHIwEEHIq0W08ow1acakXGWzLB0D1hmLZpa512bmxVB4cA2U+ne9ea6lC4Ulhng+K8IlQlzQ2f8AP59C2Qbi4yK2jgggBACAa56A13vQGvK66ASOvezJ1xydv+OY/wCbkBtwY0zJ4LfEd4fDePRAdGGZrxdrgR4G6AyIAQAgBACAEAIAJQGnI+5QET0/0pFFBssP18gIYPcGReenDmehWvcVuzjpudfhHDnd1cy+Bb+Ph9yj3PJJJJJJuSd5JOZJXKZ7+KSWEKFUyIeFBkQ4KC6FUFhCpIY0qSjMcjARYi4Ksm08ow1KcZxcZLKJDolp1UYdaN956X3Ce/EPuE8Pund0XQo3OdGeO4nwVwzOnt/N/uXTgWPU1ZH2lPK144ge008nNzaeq3U0zzM4Sg8M6KkqY3vQGB70BrvegNd70BrvegNd70Bh7Yg3aSDzBIPqEB0aXSCVvtWePHun1HyQHZpcehfmdg/e3D9WXqgOm1wO8G6AVACAEAIDBUv4IDQrqtkMT5ZDZjGlzj4D+VEmorLL0qcqk1CO70ONVaD0tYfpFQXve9oN2vs1rbXa1gHAXz45rDKhGfvSOnS4pXtV2VLCS8Nc97I5jGqMbzSz2PuSi4/W3ePQrBOz/tZ1Lb2la0rQ9V9n9yu8bwSejk7OdmySLg5hw5tIzWlUpyg8SPT2l5SuYc9J5/Q0AsRuIeFBkQ4KC6EKEMaVYoxpUmNjCpKMx0r5YJBNTSuikHFpsD4EZEeB3LZp3DjucS94RTrJuGj7un7Fh6P637WjxCItOXbRi4Pi5nD8t+i34VlJHkbnh9SjLDX88yxaDFoahnaQSskbzaQbdeR6rNk0Gmtxz3oQa73oDA96A13vQGu56AYgBACAzU1U+M3Y4t6Zeh3FAdil0kcP6jQ7xbuPodx+CA7tBXMmbtMJt4i3/vyQGygBAaMjrm6ArTW/jlmMo2ne60kn4Qe4PMi/kFp3dTTlR6X2ftMydd9NF+p2dTWIyS0T43kkRSbLCeDS0HZ6A/urWkm44fQ1+P0YQrqUf6ll/csBbRwiN6e6P/TaNzGj61nfiP3hm38wuOtlhr0u0hjqdPhN9+EuFJ/C9H9/Q8/kEGxFiMxyXGZ9Ji86oUKDIjIWEAEggHI2z6KMExkm8JjVBZjSrFGNKkoxpUmNjCpKMY9oIsRdWTa2MM4RmsSWUa0VO6N/aQSPieMi0kfEb7eC2IXEluca44NSnrB4+q+5JcO1i4jDYStZUNHEjZd+pv8ALStqNxFnCr8GrQ2WfLX9yR0WtSldumjliPTbHw3/AAWdTTOZO3nF4Z2KXTGhl9iqj6OvGfR4BU5RjcJLobwro3ezIw9HD5qSuB+2OY9UIGulaM3AdSEBrVGLU7Pbnib1e0fyoyWUZPZHIqdOKFm4Sl55MY4/EgD4qrqRRnhaVp7ROFX6xjlBB+aQ/wClvzWKVddDdpcKk/jeCaatcRZWwOfKA6aN5DgfZ2TvYWsytbdvvvCyU58yNa9t+wniOzJ7DJsuB4ZHp/sshpHTQGKodZvVAaTnAAkmwAuTyAzQlLOiPOukmKfSquWfg952fwjc34ALkVJc0mz6HZUOwoRp9y+vUu3VXh3Y4bGbb5S6Q/m3N/yhq6FtHlpo8hxmt2l3Lw0/nqS9ZzlAgKS1raPfR6rt2D6uckmw3NkHtDwvfa9eS5d3S5Zcy2Z7z2fvu3o9lJ+9H6rp8tvkRzReWFtZC6oAMQeNu4uLcLjley16Tiprm2Otfxqytpql8WND0U+CN7LFrHMcMiA5pB8MiF28Jo+Yqc4Sym016MimOauaOcExt7B/As9m/izK3Sy1qlpTltodm09obug8TfOvHf5/5Kg0kwOWinMMtr2DmuGTmm9nD0I6grm1Kbpy5We3sr2neUlVp+TXc+45RVDZY0qSjGlSY2MKkoxpUmNjSpKMxvaDmAeqsm1sYpwjL4lkwPpGH7I8tyyKrPvNOdjby/oXpoY/oTOAI6FX7aRrvh1Du+ovY/ed+oqe2kU/06gugjohxJPUkp2kmFZUY9BoiaMgPRRzNl1Rpx2ihSoJEQgmGqzF/o+IMaTZkwMbt+653sP6gB+YrNRliRocRpc9FvqtS+iFuHmzfoZNpgvmLg9Ru+O4+aAbVu3gICK6wq/scOmINi9vZj8/dPwusVeWIM6HC6XaXUF3a/Io/BcPdUVEUDc5Htb0BO8+QufJcyMeZpHtq9ZUaUqj6I9QU0DY2NY0Waxoa0cg0WA9AuulhYPnc5OcnJ7vUyKSoIDk6U4K2spZIDa5F2E/ZeN7T0vn4ErHVp88XE3LC7drXjVXr4rqedZaZ7ZDE5pDw7ZLeO1e1vVcVxaeD6bCrGUOdPTGc+B6WwqmMUEUZ3lkbGnq1oB/ZdyCxFI+WXFRVKsprq2/mzjaW6YQUAaHhz3vuQxtshxJOQWKtXjS3N7h3Cat9lxaSXVkFwXSiCsxhs9UwNb2fZQA94NdtXaXHmdp+/xHVakK0albml5I9FdcNrWnDnSoPLzzS8V4fJFi4tovR1ItNAwn3gNhw/M2xW9OjCe6PLW/Ebm3f+3N+W6+TILjeqUG7qSa33JcvJ7Rcei1J2X9rO9be0z2rx9V9n9yA43orWUtzNA4NH2x3m/qGXmtWdGcN0d634jbXH/rks92zOGVQ2mNKkoxpUmNjSpKMYVJRjSrGNjSpKMaVJjYwqSjGlSY2IhA6KQtcHNNi0gg8iDcFSQ0msM9O4PWienimGUkbH9C5oJHkbhdCLysnkKsOSbj3M6OHyWkc3m0OHl3T/pUlB9Qe8UBV+uqtsynhHFz5D+UBrf7nrTu3okei9n6fvTn5L9f0Rh1KYHtzPrHDuxgsZ4vcO8fJu78yraw15jY49dcsFRW71fkXBUztjY57zZrGlzieDWi5PoFut4WTy8IuclFbvQqbAdZ0r8QtMWimkdstFrdmCbMdf0vfn4LRhctz12PU3PA4Rtc0/jSz59/7FurfPKAgI7W6G00laytIIe0glotsvcPZc4WzG7LkFhlQi58506XFa9O2dstn16pdUiQPcACTkBc9AsxzUm3hHnLSnFzVVcsxNw5xDPBjdzQOW7f1JXEqz55uR9Q4fbK2t4010Wvn1NTCacyVEUbb3dIwC2Yu4b1WCzJIzXNRU6UpvomemWiwsu6fKWKhBosximdIYhPEZBcFm20uHMFt7qvPHOMmd21ZRU3B478PBysZ0HoKm5fAGuP24+4eu7cfMFY50IS3RtW/FbqhpGWV3PUiFbqdZv7GqcOQewH1LSP2WB2a6M6kPaOX9cPkyrcXw6SmnkglFnxusbZHiCPAix81qSi4vDPRUa0a1NVIbM0SoLMaVJRjSpMbGFWKMaVJRjSpMbGFSUYiFQQF8apa3tMNY0m5ie9nQX2gPRwW7ReYnm+Iw5a78dSYtfsyxnmSzyc0n92tWU0DO87z1QER0i0K/8A6VWHSSmOKFjWgNF3Oc4lx3nc0Zc81gqUu0lqdaz4h+Eo4jHLb9CYYJhMVJA2CFtmN8ySd5cTxJWWMVFYRz69edebnN6s4WtKsdFhc2zm/ZYejnAH4XHmsVw8U2bvB6andxz01+R59C5Z71F/6stIvpdGGvP1sNmPvm4W7r/MbuoK6lvU5467o8Lxiz/D18x+GWq/VEvWc5IICKazMW+j4fJY2dL9U383tf5dpa9zPlpvxOvwS27a7jnaPvP02+pQi5B9EyTTVNhnbYgJCO7A0vP4iNlo+JP5VtWkM1M9xwvaG57O0cFvJ49N39vUvJdU8CcbTDF/olFLNezg2zPxu7rfib+Sx1p8kGzd4fbfiLiNPp18luecmh732Ac57jutdznOJ9SVx1ln0eTjGOuiXyJbgGmtdh8oin7R0YttQyghzQfdLt7fAZLYp1503hnFu+F2t5Dnp4T6NbeuNP1L1p52yMa9pu1wDgeYIuF008rJ4ecXGTi90UnpThortIHU7XBoc5rXO5BsYc63M2BHVaFSPPW5T11nW/DcNVRrO/1ehMn6pqAs2QZg73tsX62Istj8LDByP9cuebOnlgi2OaoJ2XdTTNlHBjxsO6A7wfgsUrVrZm/R47CWlWOPFaorvFMMmp39nPE+N3JwtfxByI8QtdxcdGdanWhVXNB5RolCWNKkoxpUmNjSpKMahUEBbuo6ovFUx+6+N362uB/sC2rd6NHD4tH3oy8yx6s2DTykjP8AnAP7rYOQbZQFd43py/D8VkaW9pC9ke0wbi0gHvMPO3DjuWrOs4VPA71rw6NzaJp4km9fuTfBNMqGqA7KdocfsP7jh5HPqLhZo1YS2Zza9hXov3o+q1RtaTCndSSipLexLDtEnkLgt+9xFuKmpy8r5tilp2qrRdL4snmY2vuy4X5LkH0SPiSPQLSA0VYyQn6t/clH3Tx/KbHyPNZKNTknk0uJ2n4m3cV8S1Xn+56Ka4EXG8HJdY+ftYFQFLa48W7SrbAD3YG7/wAb7E/AN+K5t5PMuXuPb+zlv2dB1XvJ/RfvkgF1pnosl4apMIMND2rh3p3bQ8IxuZ694/mC6lpDlhnvPCe0N12tzyLaKx69fsThbRwTh6Y6ONr6bsS8sIeHtcBfvAOG8cR3isVal2kcG9w6+dnW7RLOmP58iP6D6vfoU5nmkbI8C0dgQG33F2/7Vt3rzWKjbcjyzocT41+KpqnBNLr4+BHNeOz21Pu72w+58NoW/lYrzdG/7OZ7Op3ZRzcB1nz01IKcxNeWN2Y3kkWHAOH2reXDqqwuXGOMGa64HTrVu0Ums6tfYhbcTlFR9JDz2vadptcdsu2ifVYFJ55up1JUYOn2WPdxjHgen6OXbjY8/aa0+oBXXWx86muWTRmUlSLayYaY4dMakN3Md2ZNtoS27mx4k/C6xVuXkeTe4dKqq8ez9fLxKt0b1W1NXTtqDLHE2QXY0guJbwJtuF/Na0KDksncueLU6VRwSbxuYMW1VYjCLsayYf8Ajdv/AEvAPpdHQmiKfFree+V5/sQuto5IXlkrHMeM2uBafQrG01ubsZxmsxeUaxQhjUKggLP1Gu+tqh9yI+jnfNbNv1OPxf4Y+paGLH6l55AH0IWycQ3ygKP1tMtiTvGOM/uP4XPufjPXcFf/AI3qyHBa52EZDITmSfNC0UlsAVTImOCgumXlqk0i+kUn0d5+spwGjxiyYfK2z6c10rapzR5e48Zxyz7Gt2q2l+fX57k0xGsbDE+V5s1jS49AFsSkorLOPSpSqzUI7t4PM2I1rpppJn+1I9zj1cb26cFxJPmeWfTaNONKnGnHZLBt6N4Q6rqo4G377htEfZYN7neQv52VqcHOSiY7y6jbUZVX028X0PScETWNDGizWgADkALALspY0PmkpOTcnux6kqVViWtV8da9rYmPp2O2d1w91txcHZZ3sLZeq0ZXbU8Y0PVUfZ6M7dScmptZ8PItNj7gHgRdbx5ZrDweetY2M/SsQlc03Yz6tniGbifN20ellyq8+abPfcJtuwtYp7vV+v7EYKwnQY0qSjPUWBuvSwnnFH/aF2I/Cj5xXWKsvNm8rGIpnXvUE1FPHc2EbnW4XLrXtzsFp3T1R6Tgcfcm/FEg1K46+alfTvNzTkBh49m69gehB8uiyW88xw+hp8Yt1Tqqcf6vzLGWwcc0cWwenqmbE8TJG8NoAkeLTmD0UOKe5kp1Z03mDwUPrP0Hbhz2SQvLoZSQGuN3McN+zf7TbZHw3rUq0+XVHobG9ddOMt0RCnwmokbtxwSvb7zY3OHqBZY1Fs25VYReG0asjC0kOBBGYIsR5KCyaeqLO1Gt+sqjybEPUv8Akti36nI4u9IepZuNn/p5PEW9SFsnEOlIN56lAU1rmgtWRP8AfhA/S4j+VpXK95M9RwOeaMo9zICFqncQ4KC6HBQXTHBQXTOro5jktFUNnitcbi05Pac2lWhNwllGC6tYXNJ05/4JBplrBlroxCGCKO4LwDtF5GVzYd0Z25rLWuHNY6Glw7hFO1n2jeZdPA4mimFtqqyKne/YbI4gu47ml1hfdc2sOqw0oKc1FnQvbmVvQlVistF76N6I0tCS6Fh23Cxe47RtnYchflyHJdSnRjT2PC3nEq90kqj0XRHeWU0Dk6W1roaGolZ7TYn7JHBxFgfIm/ksdWXLBtG3YUlVuYQls2jzUuOfSSzNI9ava0xip4nxyPbZ73EdwHPYtmcxc2st2pd5jiKPMWnAOzq89WSaWy7/ADK3paWSV2zEx73WvssaXGwzNhvWok3sehqVIQWZtJeOhhkYWktcCCCQQRYgjMEcChGU1lGMqSrPT2jDr0VOecMf9gXWp/Cj55dLFefm/wAzpq5rlK69GH6XBuziNvHvrSufiR6bgb/2peZMNVOib6KB0k26WfZJZ7jRfZB+9vJPos1CnyrLObxS8jXmox2XXvJ0s5yzXxCo7OGSQC5Yx7rc9lpNvgoeiLQXNJI8v6SaS1Vc8PqZNrZvstADWsB91o/c71oSm5bnraNtTorEEX5qwxmKpw6ERN2TC1sT22tZ7Gi5HMO9rzW5SknE83fUpU6zz11Opjui9HWNtUQMceD7bLx0eN4/ZWlBS3MVK4qUn7jIxobokMOlqmNeXse6IsJz2Q1xsfEbSrThy5M93cuuot7rJ2sYP1bW+9JE31eP4ushpHWqR3igKx110N4YJx9h72Ho8Aj4sP6lq3MdEzu8DqYnKHes/L/JUwWkemQ4KC6YoUFkxwQumOBUFkxVBdMc1xBuNxGSE7kwwPWRXU9mueJmCw2ZRc28Hixv1us8LmcfE5NzwW1rapcr8PtsT/BdalHLYTh0DjzBey/4mi48wtqF3B76HBuOAXFPWniS+T+RNKephnjJY5kjHCxsQ4EEZHwK2U1JaHGlCpSl7yaa9CHY1qto5nbURfAeIZZzD+V2XkbLXnawe2h2Lfj9zTWJ4l57/MjrdTz9vfVN2L8GHat62usP4N95vv2kjy6U9fMsTRrRyChi7OFuftPdYueeZP8AGS26dOMFhHn7u9q3U+ao/JdEUjrOq45MTmMdrDZaSOL2tAd8d3kufcNOo8Hr+EQnC0ipefoyKFYjos9MaGm+HUp/+PF/YF1qXwLyPn19/wAmp/2f5nZVzVNWpw6GR7JHxMc+O+w5zQSy9r7JOWQUOKbyXjVnGLjFtJ7+JtKSgIDBWw7cT2e8xzfUEKHsWg8STPKOGYfJUTMhibtPkNmj58gBck+C56WXhHsKlSMIuUtkel9C9G2YfSNgbYu9qR/vyHM9BkPALehHlWDytzXdao5P0I7rD1kMoD2EAbJUfavcsiBy2rG5d92/XxpUq8ui3NmzsHW96WkfzNrQWpmmo21FQ7aknLpCchYnZaABkA0Dcr08uOWa92oxquENlodOrG1PTs/8heejGn5q5rHZrW5HyQEW07w/t8PnYBdwZttA4lne3ehWOrHMGblhV7O4jLxx8zz0FzT2qY4KC6Y4KCyY4KC6YoUFkxwQsmKoLZFQnIITk2aHEJYXbUMr43c2OLfW2amMnHZmOrSp1VicU14k4wXWvVRWE7Gzt5/03+oFj6LZhdyW+pxLjgFCetNuP1X89SyNHdOKKssGSBkn+HJZrue7fZ3ktuFeE9jzt1wy4t9ZLK71qv2I/rC1hRwMdBSPD5nXDntNxEMjYjN/hw48ljrXCisR3N7hnCJVZKpWWI9z6/t+ZSZK5564aVJVnpfQh18NpP8A68XwaAurS+BeR4C+/wCTU/7P8ztrIaho41i0VLA6eZ2yxo8yeDWjiTyVZSUVlmWjRnVmoQWrK40D03qK7Fnh7tmF0T9iHdZuyWkG/F1r7/Fa9Kq5zOxfWFO3tk18WdWWqto4QICPaOaGUdFJJLBH35Ce87fsNJvsM91v+ypGnGOxs17urWSUnojlaytOG4fD2cZDqmQHYGfZjLtHfwOJ6KtSpyrxMtlaOtLL+FHnxjZJ5gLl8krwLk3LnOOZJ8StPVs9G3GEfBHpvDqQQwxxNyjY1g6NaB/C6CWFg8hOTnJyfUZhrduue7hDGGj8TztH4D4qSp3Khl2n1QHPQHnXTHCfotbNCBZodtM/A7vNt0vbyXNqx5ZNHtbKv21GMuvU44WM3UxwUFkxwUF0xQoLJi3QsmLdQWyLdCci3UE5BBkLoMiKSBEKiFSQxChVno/V1MH4XSkcI9nzY4sPxBXUovMEeE4lHluprx/PU7dfWRwxOllcGsYCXOPALI2kss1IQlOSjFZbPO+nul8mIT33tgYT2Uf+t3Nx+GXXn1ajm/A9fY2UbaH/ANPd/obeqCS2LRD3mSj/APNzv4Vrf4zFxZZtn6fmehVvnkgQEc040sjw6nMjrOkdcRR39p3M8mjifmqTmoo2bW2lXnhbdWebMVxGWpmfNM4ue83cT+wHADIBaLbbyz09OnGnFRjsSzVHhHbV4lI7kDS/857rB+5/KstGOZZNHidXkpcvVl4yyBrS45AEnoBdbh50TRSE9iZXe1M4vPS9m/D90B2kBzpm2cQgK51wYF2lO2qYO9D3X24xuOfk4/5ite4hlcx2eD3PJUdJ7PbzKeC0T06Y4KCyYoQumOBUFkxbqCyYt0LZFUE5BCcggyCDIIQIpIEQqIpIZJdFdOaugaWRFj4yb7EgJAJzLSCCD8PBZqdaUNEc274dRuXzSyn3obpdpxVYgA2TZZG03EbLgE8C4kkuPw8EqVZT3ItOH0rbWOr72RcrGbbJVqsk2cXpj4yD1heP5Waj8aOfxNZtp+n5o9HLoHjzlaS4/DQ07p5nWA3NaM3vOTGjmbeQBPBVlJRWWZqFCdafJE806TY9NXVDqiY7zua0ZMYL2a3wFz5krRlJyeWepoUI0YckTkqpkPQernAfodCwOFpJfrJPAkd1vkLed1vUo8sTzF9X7Wq2tlojqY04v2KdvtTOsfBg3uP/ADxWQ0yTxRhrQ0ZAADoNyAegNatj3bXLPp/z+UBoTwte0seAWuBDgciDuIR6kxk4vKPPOmOAOoap0RuWHvRu5sJ3eYyPRc6pDllg9lZXSuKSl16+ZxQsRupjgVBdMUIWTFuoLZFUE5FuhbIt0GQuhOQugyCECIQIpIEKFWIpKsaVJViFCrNvBsSdTVEdQyxdG8OAORtmPMXCvGXK8mCvSVWDg+pdcet6gMO2RKJLf0tm5vyDr7NvHctzt44PNPhNdSwsY7yo9M9LJsRm7STusbujiBuGD+XHiVrzm5s7Vtawt44W/VkdKoZ2TXVboz9Lqe1kbeGAhxvk9+bW+OVyOnNZqMOZ5ObxC57KHLHd/kXo9wAJJsBvJW4ecNPRuIyyPqnDce5Ff3RmfP5oCRoAQAQgOW+PYds8M29PmPkgI7ptoy2vpizcJWXMTjwd7pPunI+R4LHUp86Nyyu3b1M9HuUBUQOje6N7S1zSWuacwRuIXPawexhNSSlHZjAqmRMcCoLJioWyLdQTkVCcgoJyKhOQQZEQgFIEQqIpIEKFWIVJVjSpKsaVJRiFSVY0oUZvYFhElXUMgiHeec+DWjNx8AFeMXJ4Rr160aUHOR6JwDB46SnZBEO60bzxc77Tj4krejFRWEeVrVZVZucjFibzNI2ljzdYyH3WZn/nTmrGIlFPC1jGsaLNaAAPAIDIgBACAwVkG22wNnDe08j4+ByQHOjffMWINiORQEJ1jaFirYaiBtqho3gf95oGX4xwPlyWCtS5tVudXh1/2L5J/C/p+xSrmkEgggg2IO4gjgQtE9SmnqgUF0xbqCcjkLZC6E5FuoJyF0JyF0GQuhGQQCKSBEKiKSBEKsaVJViFSUY0qSrM1DRSTyNiiYXvcbNaOPyHirJNvCMVSpGEeaTwi/dCdFI6CG250z7GR/j7rfuhbtOCijy13dSrzz06I6+KV4ibu3vduY3mfkshqG7o9hhhYXP3yyb3nl91AdZACAEAIAQGjiNK49+P2xmMg9vLwPI/NAakMocLjoQdxBGYI4FAQzTzQRlWDNAAyoA38Gy24O5O+90B8MFWiparc6lhxGVD3J6x/IpispZIZHRysLHtNi1wsR/zmtJpp4Z6inUjOKlF5RiVTJkW6Fsi3UE5BCcioMghOQQjIiDIIQIpIEQqIVJDEUlWNKFGb2C4PPVyiKBhc45ng0e848Arxi5PCMFevClHmmy9NDdEIaCPdZ8zh35bbz91vJv72W7TpqKPL3d5OvLXbojtYhXNhbtOz4DiSshqBgOGOc76TOO+fYafsDhu5oCQIAQAgBACAEAIDnYhQuJ7SKwf9oH2ZAOB5HkUBq09QH33EObuc07i08iP5QHJ0n0Xp65mzK2zx7Ejfab8x4FUnTU1qbVreVLeWY7dxTelGhdTREuc3bi4Ss3j8wzaeu7xWlOlKJ6a14hSr6LR9zI4sRv5BQWyLdCchdBkW6gnIXUkZEQAhAiECKSBChUQqSrJpopq6qKq0k14YeZHfd+FpyHifis8KLlucu64nTpe7DV/QuHBMGgpIhFAwNbxOZcebjxK24xUVhHna1adaXNNj8RxFsQt7Tzk0Z+fJWMQ/CMHc5/b1G9/2WcGDhcc/BASBACAEAIAQAgBACAEBo4jhrZbOBLJB7L259CPtN8CgOYal0Z2JwGnIPHsP8/snwKA2iARY2IPmCEBDNItW9JUXdF9RJzYO4T4s4eVlgnQjLbQ6ltxWtS0l7y8d/mV1jWr+up7kR9qwfai73qz2h6LWlQlE7VDilCro3h+P3Iu9habOBBHAix9FiwdFST1QignIITkEGQQgFJAiAyU9O+R2zGxz3cmguPoFKTexjlOMVmTwS/BdWlbNYygQN+/vd+gfyQs0aEnvocyvxajDSPvPw2+ZZOjugtHSWcGdrIP+5IASDza3Jv7+K2YUoxOLccQrVtG8LuRJXOAFyQAOJ3LKaJzJMQfK7s6Zu0eL+DfFAdTCMEbEdt525Tm48Ol/wB0B10AIAQAgBACAEAIAQAgBAMlia4FrgCDmCLgoDjzYO+PfTu3f4TyS38rs2/sgNYYkGnZmY6J33vZPRw3IDda4EXBuOYQGpX4TTzi00Mcn4mg/HMKrinujLTrVKfwSaIxW6s8PffYa+Mn3XkgeT7rG7eDN6HF7mO7T9Pscap1Rxn+nVOH4mB37ELG7ZdGbUOOS/qh8n/k1HaopOFWzzjI/wBRUfhfEyLjkf7PqKzVE/jVtHSIn/UE/DeIfHF0h9f2N2m1SQj+pUyO/C1rf3urK2XVmGXG6n9MUdyg1c4fGQTE6Qj33uI/SLA+d1dUII1Z8UuZaZx5IktHQxRDZijYwDgxob+yypJbGjOpKbzJtmWWRrRdxAHM7lJQ50uMAnZhY6R3gN3zQGaDApZTtVL7DhG3+eA+KA71LTMjbssaGgcB/PNAZkAIAQAgBACAEAIAQAgBACAEAIBskYcLOAIOYIuEByJdHY77UTnxH7p3ebSgNd9JWMy7OUfod8kBidXyM/qU8jeneHqEA0Y3DxLm9Wn+LoB4xiD/ABPg75IAOMQf4nwd8kBjdjkPAuPRp/lAAxKR39One7ru/hAPZSVsmezEPU/z/CA2YNGWX2pXukPibD5/FAdinp2MFmNDR4CyAyoAQAgBACAEAIAQAgBACAEAIAQAgBACAEAIAQHPxH2SgIlOgMNL7SAleG5IDrhAKgBACAEAIAQAgBACAEAID//Z"}
        return a;
        }),...this.state.newlist]})
         })
     }
   
    constructor(props)
    {
        super(props);
        this.state = {
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            loading:false,
            kyUp:false,
            description:"",
            loadingVideo:true,
            newlist:[
                {
                name:"What's new",
                sub:"Read about new features",
                description:"User use page to learn about the new cool features and updates we have added",
                updated_at:"",
                created_at:"01/01/2020",
                url:"",
                verified:"yes",
                images:require("../images/new.png")
            }
            ],
            videoUrl:null,
            play:false,
            selectedNew:{created_at:""},
            autoplay:true,
            indexView:0,
            videostart:0,
            videoend:100,
            mimeType:"",
            showError:false
        }
        this.getNews.bind();
    }
 
componentWillUnmount()
{
if(this.Bk)
{
this.Bk.remove();
}
}

render() 
{
const {play,newlist,selectedNew,loading,autoplay,videoUrl} = this.state;
const banner_150 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "150")
const banner_320 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "320")
const banner_350 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "350")

return(<View style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
pagingEnabled
scrollEnabled={false}
showsHorizontalScrollIndicator={false}
showsVerticalScrollIndicator={false}
ref={e=>this.ScrolV=e}
style={{width:width,height:height}} >
<View style={{width:width,height:height}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
const Actions = this.props.navigation;
Actions.goBack();
}} style={[{width:40,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
<Text style={{color:"white",fontSize:18}}>WHAT'S NEW</Text>
</View>
</View>
{loading?<View style={{padding:5,paddingHorizontal:20,flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",width:"100%"}}>
<ActivityIndicator size="small" color="red" />
<Text style={{marginLeft:6,fontSize:12}}>Fetching...</Text>
</View>:null}
<ReturnADS
  list={banner_150}
  size={80}
  />
<View style={{flex:1,width:width,alignItems:"center",flexDirection:"column"}} >
<FlatList
        data={newlist.filter((a,i)=>a.verified == "yes")}
        contentContainerStyle={{paddingBottom:50}}
        renderItem={({item,index})=><TouchableOpacity
        onPress={()=>{
        // item.url = "https://www.youtube.com/embed/_z9DS9gpujY"
        this.setState({
            selectedNew:item,
            indexView:1},()=>{
        this.ScrolV.scrollTo({x:width,y:0,animated:true});
        })
        }}
        style={{width:width-20,flexDirection:"row",borderBottomWidth:0.5,borderBottomColor:"#444",marginBottom:10,backgroundColor:"white",alignItems:"center"}}>
          <View style={{width:50,height:45}}>
            <Image source={item.images} style={{width:40,height:40}} resizeMode="contain"/>
          </View>
          <View style={{flex:1,flexDirection:"column",paddingHorizontal:10}}>
            <Text style={{fontSize:14,fontWeight:"bold"}} ellipsizeMode="tail" numberOfLines={1} >{item.name}</Text>
            <Text  style={{fontSize:12}} ellipsizeMode="tail" numberOfLines={1}>{item.sub?item.sub:item.description}</Text>
            <Text style={{fontSize:12,color:"red"}}>{item.created_at}</Text>
          </View>
          <View style={{width:30,height:60,alignItems:"center",justifyContent:"center"}}>
        <Icon.MaterialIcons name="keyboard-arrow-right" size={20}/>
          </View>
        </TouchableOpacity>}
       />
</View>
<TouchableOpacity
onPress={()=>{
    this.ScrolV.scrollToEnd({animated:false}); 
    this.setState({indexView:2}) 
}}
style={{...mystyle.btn,width:120,marginVertical:10,marginBottom:50}}
>
<Text style={{color:"white"}}>Create News</Text>
</TouchableOpacity>
</View>
<View style={{width:width,height:height}}>
<View style={{flexDirection:"row",width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
this.ScrolV.scrollTo({x:0,y:0,animated:true});
this.setState({autoplay:0,indexView:0})
}} style={[{width:50,height:70,justifyContent:"center",alignItems:"center"}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View style={{flexDirection:"column",alignItems:"flex-start",flex:1,justifyContent:"flex-start"}} >
<Text style={{color:"white",fontSize:18}}>{selectedNew.name}</Text>
<Text style={{color:"white",fontSize:14}}>{selectedNew.created_at}</Text>
</View>
</View>

<View style={{width:width,flexDirection:"column",alignItems:"center",padding:20}}>

<View style={{width:width-40,minHeight:200,justifyContent:"center",alignItems:"center",flexDirection:"column"}}  >
    <Image source={selectedNew.images} style={{width:60,height:60}} resizeMode="contain"/>
    <Text style={{fontSize:18,fontWeight:"bold",marginBottom:15}}>{selectedNew.sub?"Read about new features":selectedNew.name}</Text>
    <View 
    onLayout={()=>{
        if(this.player)
        {
            // this.player.paused(false);
        }
    }}
    style={{width:width-30,height:250,backgroundColor:"#ccc",justifyContent:"center",alignItems:"center"}}>
    <WebView
     source={{html:`<iframe width="100%" height="100%" src="${String(selectedNew?.url).replace("watch?v=","embed/")}?controls=0&autoplay=1&rel=0" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`}} 
      // Can be a URL or a local file.
      
      onLoadStart={()=>{
          this.setState({loadingVideo:true})
      }}   
      onLoadEnd={()=>{
        this.setState({loadingVideo:false})
    }}           
 style={{width:width-30,height:250,backgroundColor:"#444"}} ></WebView>
{this.state.loadingVideo?<ActivityIndicator color="orange" style={{position:"absolute"}} />:this.state.showError?<Text style={{position:"absolute",color:"white",fontSize:10}}>Error invalid video</Text>:null}
<View style={{position:"absolute",bottom:0,right:0,height:50,width:60,backgroundColor:"rgba(0,0,0,0.01)",zIndex:99}}></View>
<View style={{position:"absolute",top:0,left:0,height:60,width:"100%",backgroundColor:"rgba(0,0,0,0.01)",zIndex:99}}>
</View>
</View>
    <Text style={{marginVertical:15}}>{selectedNew.description}</Text>
{selectedNew.email?<TouchableOpacity onPress={()=>{
    sendEmail(selectedNew.email,"","");
}} style={[mystyle.btn,{width:150,height:40,marginVertical:10}]}>
<Icon.Evilicons color={"white"} name="envelope" size={30} />
<Text style={{color:"white"}}>Email</Text>
</TouchableOpacity>:null}
{selectedNew.telephone?<TouchableOpacity onPress={()=>{
Linking.openURL("tel:"+selectedNew.telephone);
}} style={[mystyle.btn,{width:150,height:40,marginVertical:10}]}>
<Icon.Feather color={"white"} name="phone" size={20} />
<Text style={{color:"white",marginLeft:5}}>Call</Text>
</TouchableOpacity>:null}
    </View>
</View>
</View>
<View style={{width:width,height:height}}>
<View style={{flexDirection:"row",width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
this.ScrolV.scrollTo({x:0,y:0,animated:false});
this.setState({indexView:0})
}} style={[{width:50,height:70,justifyContent:"center",alignItems:"center"}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View style={{flexDirection:"column",alignItems:"flex-start",flex:1,justifyContent:"flex-start"}} >
<Text style={{color:"white",fontSize:16}}>Create news</Text>
</View>
</View>
<View style={{width:width,flexDirection:"column",alignItems:"center",padding:20}}>
<View style={{width:width-40,minHeight:200,justifyContent:"center",alignItems:"center",flexDirection:"column"}}  >
<Text style={{width:"100%"}}>Description</Text>
<View style={[mystyle.regInput,{width:width-30,minHeight:70,borderRadius:5}]}>
<TextInput 
    keyboardType="default"
    placeholder="Description"
    maxLength={150}
    multiline
    onChangeText={(d)=>this.setState({description:d})}
    value={this.state.description}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10}}
    />
</View>
<Text style={{width:"100%"}}>Video (duration: 2mins)</Text>
<View style={[mystyle.regInput,{width:width-30,height:200,justifyContent:"center",alignItems:"center",backgroundColor:"#444"}]}>
    {this.state.videoUrl != null?<Video 
    ref={(e)=>this.videPlayer=e}
    source={{uri:this.state.videoUrl}}
    resizeMode="contain"
    style={{width:width-30,height:200}}
    onLoadStart={(d)=>{
// console.log(d);
    }}
    onProgress={(s)=>{
        console.log(s); 
        this.setState({videostart:s.currentTime,videoend:s.seekableDuration,play:true})  
    }}
    onEnd={()=>{
        this.setState({play:false});
        // alert(this.state.videostart+"|",this.state.videoend)
    }}
    onError={()=>{
        this.setState({videoUrl:null});
        alert("Oops! this video is not accepted, please try another one. thanks");
    }}
   
    paused={!play}
    />:null}
    {this.state.videoUrl != null?<View 
    style={{position:"absolute",width:"80%",left:10,height:20,borderRadius:50,backgroundColor:"rgba(0,0,0,0.4)",bottom:20,justifyContent:"center",alignItems:"center",flexDirection:"row",paddingHorizontal:10}}>
        <View >
<Text style={{color:"white",fontSize:9,paddingRight:5}}>{parseFloat(this.state.videostart/60).toFixed(2)}</Text>
        </View>
<Slider 
   style={{width:"90%"}}
   onValueChange={(d)=>{
    this.setState({play:false,videostart:d}); 
    this.videPlayer.seek(d);
   }}
   value={this.state.videostart}
   minimumValue={0}
   maximumValue={this.state.videoend}
   resizeMode="cover"
   />
</View>:null}
{this.state.videoUrl != null?<TouchableOpacity
    onPress={()=>{
        if(this.state.videoUrl == null)
        {
            this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select a video file, thanks."})
         return ;
        }
        this.setState({play:!play},()=>{
            if(!this.state.play && this.state.videostart > this.state.videoend-10)
            {
            this.setState({videostart:0})
            }
        })
    }}
     style={{position:"absolute",width:40,height:40,borderRadius:40,backgroundColor:"rgba(0,0,0,0.4)",right:10,bottom:10,justifyContent:"center",alignItems:"center"}}>
<Icon.FontAwesome name={!play?"play":"pause"} size={20} color="white"/>
    </TouchableOpacity>:null}
</View>
<TouchableOpacity
onPress={()=>{
    DocumentPicker.show({
        filetype:[DocumentPickerUtil.video()],
      },(error,res)=>{
    if(error)
    {
      return true;
    }
    const size = (res.fileSize / (1024*1024)).toFixed(2);
    console.log(size);
    console.log(res);
    if(size > 10)
    {
      alert(`Your size file size is ${size}MB which is greater than the required 10MB`);
      return true;
    }
    this.setState({videoUrl:res.uri,play:false,mimeType:res.type})
    })
}} style={[mystyle.btn,{width:150,height:40,marginVertical:10,marginBottom:50}]}>
<Text style={{color:"white",marginLeft:5}}>{this.state.videoUrl == null?"Add Video":"Change Video"}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{
     if(this.state.description == "")
     {
        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter description, thanks."})
     }else if(this.state.videoUrl == null)
     {
        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select a video file, thanks."})
    }else if(!String(this.state.mimeType).split("/").includes("mp4"))
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select video type .mp4, thanks."})
   }else{
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          'title': 'App Permission',
         'message': `WeDeyNear app needs access to write file.`
        }).then((granted)=>{
       if(granted === "granted"){ 
 this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
 let data = '';
RNFetchBlob.fs.readStream(
    this.state.videoUrl,
    'base64',
    4095).then((ifstream) => {
    ifstream.open()
    ifstream.onData((chunk) => {
    console.log('data', data);
    data += chunk
    })
    ifstream.onError((err) => {
      console.log('oops', err)
      this.setState({showLoader:true,isProcessing:false,success:res.status,errorInfo:err.message})
    })
    ifstream.onEnd(() => {
        console.log('data', data);
        postDATA("news/sendNews",{
            user_id:parseInt(this.props.Reducer.id_user),
            description:this.state.description,
            video:data,
            image:"",
            mimeType:this.state.mimeType
        }).then((res)=>{
            if(res.message.includes("error") && !res.status)
            {
                res.message = "File format not valid."  
            }
            this.setState({showLoader:true,isProcessing:false,success:res.status,errorInfo:res.status?"Your post was successful.":res.message})
    console.log(res);
        })
    })
})
       }
    })
 
       }
}} style={[mystyle.btn,{width:150,height:40,marginVertical:10}]}>
<Text style={{color:"white",marginLeft:5}}>Submit</Text>
</TouchableOpacity>
    </View>
</View>
</View>

</ScrollView>
</View>

<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
if(this.state.success)
{
const Actions = this.props.navigation;
    Actions.goBack();
}
}} />
</View>)
    }
}
WhatsnewClass.defaultProps = {
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(WhatsnewClass);

