import React, { useState } from "react";
import { StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Button, Block, Text, theme, Icon } from 'galio-framework';
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from 'expo-web-browser';

import { materialTheme } from '../constants';
import { USER_POLICY_URL } from "../constantsEx/env"
import { HeaderHeight } from "../constantsEx/utils";

const { width } = Dimensions.get('screen');

//現在のユーザーのプラン状況
let free = true
let subscription = false
let month = false

const Plan = () => {

    const [buttonColor, setButtonColor] = useState({
      free: free,
      subscription: subscription,
      month: month,
    });
    const [checkButton, setCheckButton] = useState({
      free: free,
      subscription: subscription,
      month: month,
    });
    const [textColor, setTextColor] = useState({
      free: free,
      subscription: subscription,
      month: month,
    });
    const [shadowColor, setShadowColor] = useState({
      free: free,
      subscription: subscription,
      month: month,
    });
    

    const _handleOpenWithWebBrowser = () => {
      WebBrowser.openBrowserAsync(USER_POLICY_URL);
    };

    const changeButtonFree = () => {
      setButtonColor({free: true}), 
      setCheckButton({free: true}), 
      setTextColor({free: true}), 
      setShadowColor({free: true})
    }

    const changeButtonSubscription = () => {
      setButtonColor({subscription: true}), 
      setCheckButton({subscription: true}), 
      setTextColor({subscription: true}), 
      setShadowColor({subscription: true})
    }

    const changeButtonMonth = () => {
      setButtonColor({month: true}), 
      setCheckButton({month: true}), 
      setTextColor({month: true}), 
      setShadowColor({month: true})
    }

    return (
      <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0.25, y: 1.1 }}
      locations={[0.2, 1]}
      colors={["white", "mistyrose"]}
      style={[styles.container, { flex: 1}]}>
      <Block flex row>
      <Block flex middle>
      <KeyboardAvoidingView behavior="padding" enabled>
        <Block flex={0.1} style={{ alignItems: "center" }}>
          <Text size={26} bold color="#F69896">プラン一覧</Text>
        </Block>
        <Block flex={0.7}  space="between">
          <Block flex style={{ marginTop: 20 }}>
            <Button
              style={{ height: 80, shadowColor: shadowColor.free ? "silver" : "lightcoral", borderRadius: 20, flexDirection: 'row' }}
              color={buttonColor.free ? "white" : "lightcoral"}
              //disabled={" "}
              onPress={changeButtonFree}
              //loading={" "}
            >
              <Text color={textColor.free ? "lightcoral" : "white"} size={20} bold>2週間無料お試し</Text>
              { checkButton.free &&
                <Icon family="font-awesome" name="check-circle" size={30} color="lightcoral" styles={{paddingRight: 30}}/>
              }
            </Button>
            <Block style={{padding: 10, paddingBottom: 20}}>
              <Text color="silver" size={12} bold center>お試し期間終了後自動でノーマルに更新されます。</Text>
              <Text color="silver" size={12} bold center>キャンセルしない限り、プランは毎月自動更新されます。</Text>
            </Block>
            
            <Button
              style={{ height: 80, shadowColor: shadowColor.subscription ? "silver" : "lightcoral", borderRadius: 20, flexDirection: 'row' }}
              color={buttonColor.subscription ? "white" : "lightcoral"}
              //disabled={" "}
              onPress={changeButtonSubscription}
              //loading={" "}
            >
              <Block style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text color={textColor.subscription ? "lightcoral" : "white"} size={20} bold>ノーマル</Text>
                <Text color={textColor.subscription ? "lightcoral" : "white"} size={16} bold>￥500 / 月</Text>
              </Block>
              { checkButton.subscription &&
                <Icon family="font-awesome" name="check-circle" size={30} color="lightcoral" styles={{alignItems: "right"}}/>
              }
            </Button>
            <Block style={{padding: 10, paddingBottom: 20}}>
              <Text color="silver" size={12} bold center>キャンセルしない限り、プランは毎月自動更新されます。</Text>
            </Block>
            <Button
              style={{ height: 80, shadowColor: shadowColor.month ? "silver" : "lightcoral", borderRadius: 20, flexDirection: 'row' }}
              color={buttonColor.month ? "white" : "lightcoral"}
              //disabled={" "}
              onPress={changeButtonMonth}
              //loading={" "}
            >
              <Block style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text color={textColor.month ? "lightcoral" : "white"} size={20} bold>1month</Text>
                <Text color={textColor.month ? "lightcoral" : "white"} size={16} bold>￥700</Text>
              </Block>
              { checkButton.month &&
                <Icon family="font-awesome" name="check-circle" size={30} color="lightcoral" styles={{alignItems: "right"}}/>
              }
            </Button>
            <Block style={{padding: 10, paddingBottom: 20}}>
              <Text color="silver" size={12} bold center>一ヶ月のみのプランです。</Text>
            </Block>
  
            <Block style={{padding: 10}}>
              <Text color="lightcoral" size={12} bold center>購入を復元する</Text>
            </Block>
            <Block style={{padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text color="#F69896" size={12} bold center onPress={_handleOpenWithWebBrowser}
              >利用規約
            </Text>
            <Text
              color="silver" size={12} bold center
              >と
            </Text>
              <Text
              color="#F69896" size={12} bold center
              onPress={_handleOpenWithWebBrowser}
              >プライバシーポリシー
            </Text>
            </Block>
            
          </Block>
        </Block>
      </KeyboardAvoidingView>
    </Block>
    </Block>
    </LinearGradient>
    );
}

export default Plan;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  }
});
