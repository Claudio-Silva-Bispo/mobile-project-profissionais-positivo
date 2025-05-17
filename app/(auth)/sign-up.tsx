import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';


export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  
  // OAuth para Google e Facebook
    const { startOAuthFlow: startGoogleAuth } = useOAuth({ strategy: 'oauth_google' });
    const { startOAuthFlow: startFacebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    code: ''
  });
  const [socialLoading, setSocialLoading] = useState({
      google: false,
      facebook: false
    });

  // Validação do formulário
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '', code: '' };

    if (!emailAddress.trim()) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Cadastro inicial
  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
      Alert.alert('Sucesso', 'Código de verificação enviado para seu e-mail');
    } catch (err: any) {
      console.error('Sign up error:', err);
      
      if (err.errors) {
        const clerkError = err.errors[0];
        Alert.alert('Erro', clerkError.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Verificação do código
  const onVerifyPress = async () => {
    if (!isLoaded || loading) return;

    if (!code) {
      setErrors(prev => ({...prev, code: 'Código é obrigatório'}));
      return;
    }

    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(home)/home-page');
        Alert.alert('Sucesso', 'Conta verificada com sucesso!');
      } else {
        console.log('Sign up attempt status:', signUpAttempt.status);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      
      if (err.errors) {
        const clerkError = err.errors[0];
        Alert.alert('Erro', clerkError.message);
        setErrors(prev => ({...prev, code: 'Código inválido'}));
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao verificar seu código. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Tela de verificação
  if (pendingVerification) {
    return (

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Verificação de e-mail</Text>
            <Text style={styles.subtitle}>
              Enviamos um código de verificação para {'\n'}
              <Text style={{ fontWeight: 'bold' }}>{emailAddress}</Text>
            </Text>
            
            <View style={styles.form}>
              <Text style={styles.label}>Código de Verificação</Text>
              <TextInput
                style={[styles.input, errors.code && styles.inputError]}
                value={code}
                placeholder="Digite o código de 6 dígitos"
                onChangeText={setCode}
                autoFocus
              />
              {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}

              <TouchableOpacity 
                style={styles.button} 
                onPress={onVerifyPress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verificar</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Não recebeu o código?</Text>
              <TouchableOpacity 
                onPress={onSignUpPress}
                disabled={loading}
              >
                <Text style={styles.footerLinkText}>Reenviar código</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  // Função genérica para autenticação social
    const handleSocialAuth = async (strategy: 'google' | 'facebook') => {
      if (!isLoaded) return;
  
      setSocialLoading(prev => ({ ...prev, [strategy]: true }));
  
      try {
        const startAuth = strategy === 'google' ? startGoogleAuth : startFacebookAuth;
        const { createdSessionId, setActive } = await startAuth();
  
        if (createdSessionId) {
          await setActive!({ session: createdSessionId });
          router.replace('/');
        }
      } catch (err: any) {
        console.error(`OAuth ${strategy} error:`, err);
        Alert.alert(
          'Erro', 
          err.errors?.[0]?.message || `Falha ao fazer login com ${strategy === 'google' ? 'Google' : 'Facebook'}`
        );
      } finally {
        setSocialLoading(prev => ({ ...prev, [strategy]: false }));
      }
  };

  

  // Tela de cadastro inicial
  return (

    <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>

                {/* Voltar */}
                {/*<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>*/}

                {/* Logo */}
                <View style={styles.logoContainer}>
                  <Image
                    source={require('@/assets/images/logo/logo.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>

                {/*<Text style={styles.title}>Criar Conta</Text>*/}
                <Text style={styles.subtitle}>Preencha seus dados para se cadastrar</Text>
                
                <View style={styles.form}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={emailAddress}
                    placeholder="seu@email.com"
                    onChangeText={setEmailAddress}
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                  <Text style={styles.label}>Senha</Text>
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    value={password}
                    placeholder="••••••••"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                  />
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={onSignUpPress}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Continuar</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Divisor */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ou</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Login usando Google ou Facebook */}
                <View style={styles.socialLoginContainer}>
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.googleButton]}
                    onPress={() => handleSocialAuth('google')}
                    disabled={socialLoading.google}
                  >
                    {socialLoading.google ? (
                      <ActivityIndicator color="#333" />
                    ) : (
                      <>
                        <Image
                          source={require('@/assets/images/login/imagem-um.png')}
                          style={styles.socialIcon}
                        />
                        <Text style={styles.socialButtonText}>Google</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.facebookButton]}
                    onPress={() => handleSocialAuth('facebook')}
                    disabled={socialLoading.facebook}
                  >
                    {socialLoading.facebook ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Image
                          source={require('@/assets/images/login/imagem-dois.png')}
                          style={styles.socialIcon}
                        />
                        <Text style={[styles.socialButtonText, styles.facebookButtonText]}>Facebook</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Já tem uma conta?</Text>
                  <Link href="/sign-in" style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Faça login</Text>
                  </Link>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical:20,
  },
  logo: {
    width: 200,
    height: 120,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 20,          
    backgroundColor: '#001F3F',  
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 5,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  facebookButton: {
    backgroundColor: '#fff',
    borderColor: '#1877F2',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  facebookButtonText: {
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    marginLeft: 4,
  },
  footerLinkText: {
    color: '#007AFF',
    fontWeight: '500',
  },

});