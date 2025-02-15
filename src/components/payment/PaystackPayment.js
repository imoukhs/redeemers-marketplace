import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PaystackWebView } from 'react-native-paystack-webview';
import { paymentAPI } from '../../services/api/payment';

const PaystackPayment = ({ 
  amount, 
  email, 
  onSuccess, 
  onCancel, 
  onError,
  metadata = {} 
}) => {
  const { publicKey } = paymentAPI.getPaymentConfig();

  return (
    <View style={styles.container}>
      <PaystackWebView
        paystackKey={publicKey}
        amount={amount}
        billingEmail={email}
        onSuccess={onSuccess}
        onCancel={onCancel}
        onError={onError}
        autoStart={true}
        channels={["card", "bank", "ussd", "qr", "mobile_money"]}
        refNumber={`REF-${Date.now()}`}
        billingName={metadata.customerName}
        billingMobile={metadata.phoneNumber}
        metadata={{
          ...metadata,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: metadata.orderId
            }
          ]
        }}
        activityIndicatorColor="green"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
});

export default PaystackPayment; 