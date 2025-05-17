import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await user.update({
        firstName,
        lastName
      });
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.errors?.[0]?.message || 'Falha ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (err: any) {
      Alert.alert('Erro', err.errors?.[0]?.message || 'Falha ao sair');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>

        {/* Voltar */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.profileHeader}>
            <Image
            source={{ uri: user?.imageUrl }}
            style={styles.profileImage}
            />
            
            <Text style={styles.profileName}>
            {user?.firstName} {user?.lastName}
            </Text>
            {/*<Text style={styles.profileEmail}>{user?.emailAddresses[0]?.emailAddress}</Text>*/}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            
            {isEditing ? (
            <>
                <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Seu nome"
                />
                </View>
                
                <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sobrenome</Text>
                <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Seu sobrenome"
                />
                </View>
            </>
            ) : (
            <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Nome Completo</Text>
                <Text style={styles.infoValue}>
                {user?.firstName} {user?.lastName}
                </Text>
            </View>
            )}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conta</Text>
            <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
                {user?.emailAddresses[0]?.emailAddress}
            </Text>
            </View>
        </View>

        <View style={styles.actions}>
            {isEditing ? (
            <>
                <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
                >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Salvar Alterações</Text>
                )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
                disabled={loading}
                >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
                </TouchableOpacity>
            </>
            ) : (
            <>
                <TouchableOpacity 
                style={[styles.button, styles.editButton]}
                onPress={() => setIsEditing(true)}
                >
                <Text style={styles.buttonText}>Editar Perfil</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                style={[styles.button, styles.logoutButton]}
                onPress={handleSignOut}
                >
                <Text style={[styles.buttonText, styles.logoutButtonText]}>Sair</Text>
                </TouchableOpacity>
            </>
            )}
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
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 60,
    marginBottom: 15,
    backgroundColor: '#e1e1e1',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  infoGroup: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  idText: {
    fontSize: 12,
    color: '#999',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  actions: {
    marginTop: 10,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  cancelButtonText: {
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  logoutButtonText: {
    color: '#ff3b30',
  },
});