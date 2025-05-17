import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Page() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        
        {/* Quando o usuário estiver logado */}
        <SignedIn>
           <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.header}>
                <Text style={styles.welcomeText}>
                  Bem-vindo, {'\n'}
                  <Text style={styles.userName}>{user?.firstName || 'Usuário'}</Text>!
                </Text>
                
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: user?.imageUrl }}
                    style={styles.avatar}
                  />
                </View>
              </View>
      
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Como usar o app</Text>
                
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>1</Text>
                  <Text style={styles.instructionText}>
                    Preencha os dados básicos complementares
                  </Text>
                </View>
                
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>2</Text>
                  <Text style={styles.instructionText}>
                    Deixe disponível suas informações para nossos parceiros
                  </Text>
                </View>
                
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>3</Text>
                  <Text style={styles.instructionText}>
                    Feche serviços de forma simples e rápida
                  </Text>
                </View>
              </View>
      
              <View style={styles.quickActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/profile')}
                >
                  <Text style={styles.actionButtonText}>Meu Perfil</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.primaryAction]}
                  onPress={() => router.push('/preference')}
                >
                  <Text style={[styles.actionButtonText, styles.primaryActionText]}>
                    Começar a usar
                  </Text>
                </TouchableOpacity>
              </View>
      
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Precisa de ajuda? {' '}
                  <Link href="/" style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Fale conosco</Text>
                  </Link>
                </Text>
              </View>
            </ScrollView>
        </SignedIn>
        
        {/* Quando o usuário não estiver logado */}
        <SignedOut>
          <ScrollView contentContainerStyle={styles.container}>
              <ThemedView style={styles.authContainer}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/assets/images/logo/logo.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
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
            </ScrollView>
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
    marginVertical: 20,
  },
  logo: {
    width: 300,
    height: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 24,
    color: '#333',
    lineHeight: 32,
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
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e1e1e1',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  primaryAction: {
    backgroundColor: '#007AFF',
  },
  primaryActionText: {
    color: '#fff',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    alignItems: 'center',
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