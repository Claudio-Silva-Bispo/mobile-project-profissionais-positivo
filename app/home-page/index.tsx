import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Page() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.logoContainer}>
            <Image
            source={require('@/assets/images/logo/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
            />
        </View>

        <SignedIn>
            <ThemedView style={styles.profileContainer}>
            <View style={styles.profileHeader}>
                <ThemedText style={styles.welcomeText}>Bem-vindo(a),</ThemedText>
                <ThemedText style={styles.userName}>{user?.firstName || 'Usuário'}</ThemedText>
            </View>
            
            <ThemedView style={styles.emailContainer}>
                <ThemedText style={styles.emailLabel}>Email:</ThemedText>
                <ThemedText style={styles.emailValue}>{user?.emailAddresses[0].emailAddress}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton}>
                <ThemedText style={styles.actionButtonText}>Meu Perfil</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                <ThemedText style={styles.actionButtonText}>Configurações</ThemedText>
                </TouchableOpacity>
                
            </ThemedView>
            </ThemedView>
        </SignedIn>
        
        <SignedOut>
            <ThemedView style={styles.authContainer}>
            <ThemedText style={styles.welcomeText}>Bem-vindo(a)</ThemedText>
            <ThemedText style={styles.authDescription}>
                Entre na sua conta ou crie uma nova para acessar todos os recursos
            </ThemedText>
            
            <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity style={styles.signInButton}>
                <ThemedText style={styles.signInButtonText}>Entrar</ThemedText>
                </TouchableOpacity>
            </Link>
            
            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <ThemedText style={styles.separatorText}>ou</ThemedText>
                <View style={styles.separator} />
            </View>
            
            <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity style={styles.signUpButton}>
                <ThemedText style={styles.signUpButtonText}>Criar nova conta</ThemedText>
                </TouchableOpacity>
            </Link>
            </ThemedView>
        </SignedOut>
        </ThemedView>
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
    padding: 20,
    backgroundColor: '#fff'
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 400,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  // Estilos para usuários autenticados
  profileContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  profileHeader: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 4,
    color: '#000'
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#edf2f7',
    borderRadius: 8,
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emailValue: {
    fontSize: 16,
  },
  actionContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },

  // Estilos para usuários não autenticados
  authContainer: {
    padding: 25,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  authDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
    color: '#666',
  },
  signInButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  signInButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 25,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    paddingHorizontal: 15,
    color: '#666',
  },
  signUpButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  signUpButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000'
  },
});