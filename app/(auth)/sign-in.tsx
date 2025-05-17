import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert, Image, Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

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
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onSignInPress = async () => {
    if (!isLoaded || loading) return;
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/'); // Redireciona para uma rota específica após login
      } else {
        console.log('Sign in attempt status:', signInAttempt.status);
        // Aqui você pode lidar com casos onde mais passos são necessários
        // Por exemplo, verificação 2FA, reset de senha, etc.
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      
      // Tratamento de erros específicos do Clerk
      if (err.errors) {
        const clerkError = err.errors[0];
        Alert.alert('Erro', clerkError.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>

          {/* Voltar */}
          <TouchableOpacity onPress={() => router.push('/home-page')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Faça login na sua conta</Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              placeholder="seu@email.com"
              placeholderTextColor={'#000'}
              onChangeText={setEmailAddress}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={password}
              placeholder="••••••"
              placeholderTextColor={'#000'}
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity 
              style={styles.button} 
              onPress={onSignInPress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continuar</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <Link href="/sign-up" style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Cadastre-se</Text>
            </Link>
          </View>

          <Link href="/reset-password" style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </Link>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,          
    backgroundColor: '#001F3F',  
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical:40,
  },
  logo: {
    width: 300,
    height: 120,
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
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
  forgotPassword: {
    marginTop: 16,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
});