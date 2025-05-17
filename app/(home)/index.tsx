import { useUser } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
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
              Explore os recursos principais na navegação inferior
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              Acesse seu perfil para editar suas informações
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              Personalize as configurações conforme suas preferências
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
            onPress={() => router.push('/features')}
          >
            <Text style={[styles.actionButtonText, styles.primaryActionText]}>
              Começar a usar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Precisa de ajuda? {' '}
            <Link href="/support" style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Fale conosco</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
    paddingTop: 80
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
  userName: {
    fontWeight: 'bold',
    color: '#007AFF',
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
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: '600',
    color: '#333',
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