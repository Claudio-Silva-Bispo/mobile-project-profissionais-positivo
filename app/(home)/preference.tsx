import { useUser } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import firebase from '../../firebaseConfig';

export default function PreferenciasAtendimentoScreen() {
  const firestore = getFirestore(firebase);
  const { user } = useUser();
  console.log("user.id:", user ? user.id : "user not loaded");

  // Estados para cada preferência
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [idiomaSelecionado, setIdiomaSelecionado] = useState<string | null>(null);
  const [horarioAtivo, setHorarioAtivo] = useState(false);
  const [faixaHorario, setFaixaHorario] = useState({
    '08:00': false,
    '09:00': false,
    '10:00': false,
    '11:00': false,
    '12:00': false,
    '13:00': false,
    '14:00': false,
    '15:00': false,
    '16:00': false,
    '17:00': false,
    '18:00': false,
    '19:00': false,
    '20:00': false
  });
  
  const [tipoAtendimentoSelecionado, setTipoAtendimentoSelecionado] = useState<string | null>(null);
  const [acessibilidadeSelecionada, setAcessibilidadeSelecionada] = useState<string | null>(null);
  const [receberNotificacoes, setReceberNotificacoes] = useState(false);
  const [canaisNotificacao, setCanaisNotificacao] = useState({
    whatsapp: false,
    email: false,
    sms: false,
    push: false
  });

  // Opções disponíveis
  const diasSemana = [
    { id: 'segunda', nome: 'Segunda-feira' },
    { id: 'terca', nome: 'Terça-feira' },
    { id: 'quarta', nome: 'Quarta-feira' },
    { id: 'quinta', nome: 'Quinta-feira' },
    { id: 'sexta', nome: 'Sexta-feira' },
    { id: 'sabado', nome: 'Sábado' },
    { id: 'qualquer', nome: 'Qualquer dia' }
  ];

  const idiomas: { id: string; nome: string; icone: "weather-sunny" | "weather-partly-cloudy" | "weather-night" }[] = [
    { id: 'manha', nome: 'Português', icone: 'weather-sunny' },
    { id: 'tarde', nome: 'Inglês', icone: 'weather-partly-cloudy' },
    { id: 'noite', nome: 'Espanhol', icone: 'weather-night' }
  ];

  const tiposAtendimento: { id: string; nome: string; descricao: string; icone: "email" | "sms" | "store" | "videocam" | undefined }[] = [
      { id: 'helper', nome: 'Helper', descricao: 'Serviços em geral', icone: 'store' },
      { id: 'motorista', nome: 'Motorista', descricao: 'Possui permissão para dirigir', icone: 'videocam' }
  ];

  const tiposAcessibilidade = [
    { id: 'cadeirante', nome: 'Cadeirante', icone: 'wheelchair-accessibility' },
    { id: 'visual', nome: 'Deficiência Visual', icone: 'eye-off' },
    { id: 'auditiva', nome: 'Deficiência Auditiva', icone: 'hearing-disabled' },
    { id: 'mobilidade', nome: 'Mobilidade Reduzida', icone: 'accessible' },
    { id: 'nenhuma', nome: 'Nenhuma', icone: 'check-circle' }
  ];

  // Carregar preferências existentes
  useEffect(() => {
      if (!user) return;
  
      const carregarPreferencias = async () => {
        try {
          // Carregar dia
          const diaDoc = await getDoc(doc(firestore, 't_dia_preferencia_usuario', user.id));
          if (diaDoc.exists()) {
            setDiaSelecionado(diaDoc.data().preferencia);
          }
  
          // Carregar turno
          const idiomasDoc = await getDoc(doc(firestore, 't_idioma_usuario', user.id));
          if (idiomasDoc.exists()) {
            setIdiomaSelecionado(idiomasDoc.data().preferencia);
          }
  
          // Carregar horários
          const horarioDoc = await getDoc(doc(firestore, 't_horario_preferencia_usuario', user.id));
          if (horarioDoc.exists()) {
            setHorarioAtivo(horarioDoc.data().ativo);
            setFaixaHorario(horarioDoc.data().horarios || {
              "08:00": false,
              "09:00": false,
              "10:00": false,
              "11:00": false,
              "12:00": false,
              "13:00": false,
              "14:00": false,
              "15:00": false,
              "16:00": false,
              "17:00": false,
              "18:00": false,
              "19:00": false,
              "20:00": false,
              "21:00": false
            });
          }
        

        // Carregar tipo de atendimento
        const tipoDoc = await getDoc(doc(firestore, 't_tipo_atendimento_preferencia_usuario', user.id));
        if (tipoDoc.exists()) {
          setTipoAtendimentoSelecionado(tipoDoc.data().preferencia);
        }

        // Carregar acessibilidade
        const acessibilidadeDoc = await getDoc(doc(firestore, 't_acessibilidade_preferencia', user.id));
        if (acessibilidadeDoc.exists()) {
          setAcessibilidadeSelecionada(acessibilidadeDoc.data().preferencia);
        }

        // Carregar notificações
        const notifDoc = await getDoc(doc(firestore, 't_notificacao_preferencia', user.id));
        if (notifDoc.exists()) {
          setReceberNotificacoes(notifDoc.data().ativo);
          setCanaisNotificacao(notifDoc.data().canais || {
            whatsapp: false,
            email: false,
            sms: false,
            push: false
          });
        }

      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
        Alert.alert("Erro", "Não foi possível carregar suas preferências.");
      }
    };

    carregarPreferencias();
  }, [user]);

  // Funções para salvar no Firebase
  const salvarPreferenciaDia = async () => {
    if (!user || !diaSelecionado) return;
    
    try {
      await setDoc(doc(firestore, 't_dia_preferencia_usuario', user.id), {
        preferencia: diaSelecionado,
        idCliente: String(user.id),
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferência de dia salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferência de dia:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência de dia.");
    }
  };

  const salvarPreferenciaIdioma = async () => {
    if (!user || !idiomaSelecionado) return;
    
    try {
      await setDoc(doc(firestore, 't_idioma_usuario', user.id), {
        preferencia: idiomaSelecionado,
        idCliente: String(user.id),
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Idioma salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar idioma do usuário:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência de idioma.");
    }
  };

   // Função para salvar preferências de horário
   const salvarPreferenciaHorario = async () => {
    if (!user) return;
    
    try {
      await setDoc(doc(firestore, 't_horario_preferencia_usuario', user.id), {
        ativo: horarioAtivo,
        idCliente: String(user.id),
        faixas: faixaHorario,
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferências de horário salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferências de horários:", error);
      Alert.alert("Erro", "Não foi possível salvar suas preferências de horários.");
    }
  };

  const salvarPreferenciaTipoAtendimento = async () => {
    if (!user || !tipoAtendimentoSelecionado) return;
    
    try {
      await setDoc(doc(firestore, 't_tipo_atendimento_preferencia_usuario', user.id), {
        preferencia: tipoAtendimentoSelecionado,
        idCliente: String(user.id),
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferência de tipo de atendimento salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferência de tipo de atendimento:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência de tipo de atendimento.");
    }
  };

  const salvarPreferenciaAcessibilidade = async () => {
    if (!user || !acessibilidadeSelecionada) return;
    
    try {
      await setDoc(doc(firestore, 't_acessibilidade_preferencia', user.id), {
        preferencia: acessibilidadeSelecionada,
        idCliente: String(user.id),
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferência de acessibilidade salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferência de acessibilidade:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência de acessibilidade.");
    }
  };

  const salvarPreferenciaNotificacao = async () => {
    if (!user) return;
    
    try {
      await setDoc(doc(firestore, 't_notificacao_preferencia', user.id), {
        ativo: receberNotificacoes,
        idCliente: String(user.id),
        canais: canaisNotificacao,
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferências de notificação salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferências de notificação:", error);
      Alert.alert("Erro", "Não foi possível salvar suas preferências de notificação.");
    }
  };

  // Alternar canal de notificação
  const toggleCanalNotificacao = (canal: keyof typeof canaisNotificacao) => {
    setCanaisNotificacao(prev => ({
      ...prev,
      [canal]: !prev[canal]
    }));
  };

  // Alternar faixas de horários
  const toggleFaixaHorarios = (horario: keyof typeof faixaHorario) => {
      setFaixaHorario(prev => ({
        ...prev,
        [horario]: !prev[horario]
      }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0D6EFD" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferências de Atendimento</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Dias da Semana */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Dia disponíveis</Text>
          <Text style={styles.secaoDescricao}>Informe os dias que você pode trabalhar</Text>
          
          <View style={styles.opcoesContainer}>
            {diasSemana.map((dia) => (
              <TouchableOpacity 
                key={dia.id}
                style={[
                  styles.opcaoDia, 
                  diaSelecionado === dia.id && styles.opcaoSelecionada
                ]}
                onPress={() => setDiaSelecionado(dia.id)}
              >
                <Text style={[
                  styles.opcaoDiaTexto,
                  diaSelecionado === dia.id && styles.opcaoTextoSelecionado
                ]}>
                  {dia.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.botaoSalvar, !diaSelecionado && styles.botaoDesabilitado]}
            onPress={salvarPreferenciaDia}
            disabled={!diaSelecionado}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferência de Dia</Text>
          </TouchableOpacity>
        </View>

        

        {/* Horários */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Horários</Text>
          <Text style={styles.secaoDescricao}>Defina horários específicos para seu atendimento</Text>
          
          <View style={styles.notificacaoSwitch}>
            <Text style={styles.notificacaoTexto}>Deseja definir?</Text>
            <Switch
              trackColor={{ false: "#dddddd", true: "#a0c4ff" }}
              thumbColor={horarioAtivo ? "#0D6EFD" : "#f4f3f4"}
              onValueChange={() => setHorarioAtivo(prev => !prev)}
              value={horarioAtivo}
            />
          </View>
          
          {horarioAtivo && (
            <View style={styles.horariosContainer}>
              <Text style={styles.horariosTexto}>Selecione os horários disponíveis:</Text>
              
              <View style={styles.horariosGrid}>
                {Object.keys(faixaHorario).map((hora) => (
                  <TouchableOpacity 
                    key={hora}
                    style={[
                      styles.horarioItem,
                      faixaHorario[hora as keyof typeof faixaHorario] && styles.horarioSelecionado
                    ]}
                    onPress={() => toggleFaixaHorarios(hora as keyof typeof faixaHorario)}
                  >
                    <Text style={[
                      styles.horarioTexto,
                      faixaHorario[hora as keyof typeof faixaHorario] && styles.horarioTextoSelecionado
                    ]}>
                      {hora}
                    </Text>
                    {faixaHorario[hora as keyof typeof faixaHorario] && (
                      <Ionicons name="checkmark-circle" size={16} color="#0D6EFD" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.botaoSalvar}
            onPress={salvarPreferenciaHorario}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferências de Horário</Text>
          </TouchableOpacity>
        </View>

        {/* Idioma */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Idioma</Text>
          <Text style={styles.secaoDescricao}>Escolha os idiomas que você tem fluência</Text>
          
          <View style={styles.turnosContainer}>
            {idiomas.map((idioma) => (
              <TouchableOpacity 
                key={idioma.id}
                style={[
                  styles.turnoItem,
                  idiomaSelecionado === idioma.id && styles.idiomaSelecionado
                ]}
                onPress={() => setIdiomaSelecionado(idioma.id)}
              >
                <View style={styles.turnoIconeContainer}>
                  <MaterialCommunityIcons 
                    name={idioma.icone} 
                    size={28} 
                    color={idiomaSelecionado === idioma.id ? "#0D6EFD" : "#555555"} 
                  />
                </View>
                <View style={styles.turnoInfo}>
                  <Text style={[
                    styles.turnoNome,
                    idiomaSelecionado === idioma.id && styles.turnoTextoSelecionado
                  ]}>
                    {idioma.nome}
                  </Text>
                </View>
                {idiomaSelecionado === idioma.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#0D6EFD" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.botaoSalvar, !idiomaSelecionado && styles.botaoDesabilitado]}
            onPress={salvarPreferenciaIdioma}
            disabled={!idiomaSelecionado}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferência de Idioma</Text>
          </TouchableOpacity>
        </View>

        {/* Tipo de função */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Função</Text>
          <Text style={styles.secaoDescricao}>Qual sua principal função?</Text>
          
          <View style={styles.tiposContainer}>
            {tiposAtendimento.map((tipo) => (
              <TouchableOpacity 
                key={tipo.id}
                style={[
                  styles.tipoItem,
                  tipoAtendimentoSelecionado === tipo.id && styles.tipoSelecionado
                ]}
                onPress={() => setTipoAtendimentoSelecionado(tipo.id)}
              >
                <View style={styles.tipoIconeContainer}>
                  <MaterialIcons 
                    name={tipo.icone} 
                    size={28} 
                    color={tipoAtendimentoSelecionado === tipo.id ? "#0D6EFD" : "#555555"} 
                  />
                </View>
                <View style={styles.tipoInfo}>
                  <Text style={[
                    styles.tipoNome,
                    tipoAtendimentoSelecionado === tipo.id && styles.tipoTextoSelecionado
                  ]}>
                    {tipo.nome}
                  </Text>
                  <Text style={styles.tipoDescricao}>
                    {tipo.descricao}
                  </Text>
                </View>
                {tipoAtendimentoSelecionado === tipo.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#0D6EFD" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.botaoSalvar, !tipoAtendimentoSelecionado && styles.botaoDesabilitado]}
            onPress={salvarPreferenciaTipoAtendimento}
            disabled={!tipoAtendimentoSelecionado}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Função</Text>
          </TouchableOpacity>
        </View>

        {/* Acessibilidade */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Acessibilidade</Text>
          <Text style={styles.secaoDescricao}>Você possui algum tipo de acessibilidade?</Text>
          
          <View style={styles.acessibilidadeContainer}>
            {tiposAcessibilidade.map((tipo) => (
              <TouchableOpacity 
                key={tipo.id}
                style={[
                  styles.acessibilidadeItem,
                  acessibilidadeSelecionada === tipo.id && styles.acessibilidadeSelecionada
                ]}
                onPress={() => setAcessibilidadeSelecionada(tipo.id)}
              >
                <View style={styles.acessibilidadeIconeContainer}>
                  <MaterialIcons 
                    /*name={tipo.icone} */
                    size={24} 
                    color={acessibilidadeSelecionada === tipo.id ? "#0D6EFD" : "#555555"} 
                  />
                </View>
                <Text style={[
                  styles.acessibilidadeNome,
                  acessibilidadeSelecionada === tipo.id && styles.acessibilidadeTextoSelecionado
                ]}>
                  {tipo.nome}
                </Text>
                {acessibilidadeSelecionada === tipo.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.botaoSalvar, !acessibilidadeSelecionada && styles.botaoDesabilitado]}
            onPress={salvarPreferenciaAcessibilidade}
            disabled={!acessibilidadeSelecionada}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferência</Text>
          </TouchableOpacity>
        </View>

        {/* Notificações */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Notificações</Text>
          
          <View style={styles.notificacaoSwitch}>
            <Text style={styles.notificacaoTexto}>Deseja receber notificações?</Text>
            <Switch
              trackColor={{ false: "#dddddd", true: "#a0c4ff" }}
              thumbColor={receberNotificacoes ? "#0D6EFD" : "#f4f3f4"}
              onValueChange={() => setReceberNotificacoes(prev => !prev)}
              value={receberNotificacoes}
            />
          </View>
          
          {receberNotificacoes && (
            <View style={styles.canaisContainer}>
              <Text style={styles.canaisTexto}>Por quais canais?</Text>
              
              <TouchableOpacity 
                style={[
                  styles.canalItem,
                  canaisNotificacao.whatsapp && styles.canalSelecionado
                ]}
                onPress={() => toggleCanalNotificacao('whatsapp')}
              >
                <MaterialCommunityIcons 
                  name="whatsapp" 
                  size={24} 
                  color={canaisNotificacao.whatsapp ? "#0D6EFD" : "#555555"} 
                />
                <Text style={[
                  styles.canalTexto,
                  canaisNotificacao.whatsapp && styles.canalSelecionado
                ]}>
                  WhatsApp
                </Text>
                {canaisNotificacao.whatsapp && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.canalItem,
                  canaisNotificacao.email && styles.canalSelecionado
                ]}
                onPress={() => toggleCanalNotificacao('email')}
              >
                <MaterialIcons 
                  name="email" 
                  size={24} 
                  color={canaisNotificacao.email ? "#0D6EFD" : "#555555"} 
                />
                <Text style={[
                  styles.canalTexto,
                  canaisNotificacao.email && styles.canalSelecionado
                ]}>
                  E-mail
                </Text>
                {canaisNotificacao.email && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.canalItem,
                  canaisNotificacao.sms && styles.canalSelecionado
                ]}
                onPress={() => toggleCanalNotificacao('sms')}
              >
                <MaterialIcons 
                  name="sms" 
                  size={24} 
                  color={canaisNotificacao.sms ? "#0D6EFD" : "#555555"} 
                />
                <Text style={[
                  styles.canalTexto,
                  canaisNotificacao.sms && styles.canalSelecionado
                ]}>
                  SMS
                </Text>
                {canaisNotificacao.sms && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.canalItem,
                  canaisNotificacao.push && styles.canalSelecionado
                ]}
                onPress={() => toggleCanalNotificacao('push')}
              >
                <MaterialIcons 
                  name="notifications" 
                  size={24} 
                  color={canaisNotificacao.push ? "#0D6EFD" : "#555555"} 
                />
                <Text style={[
                  styles.canalTexto,
                  canaisNotificacao.push && styles.canalSelecionado
                ]}>
                  Push
                </Text>
                {canaisNotificacao.push && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.botaoSalvar}
            onPress={salvarPreferenciaNotificacao}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferências</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D6EFD',
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  secao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  secaoDescricao: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  opcoesContainer: {
    marginBottom: 20,
  },
  opcaoDia: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  opcaoSelecionada: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  opcaoDiaTexto: {
    fontSize: 16,
    color: '#333333',
  },
  opcaoTextoSelecionado: {
    color: '#0D6EFD',
    fontWeight: '600',
  },
  botaoSalvar: {
    backgroundColor: '#0D6EFD',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#CCCCCC',
  },
  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  turnosContainer: {
    marginBottom: 20,
  },
  turnoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  idiomaSelecionado: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  turnoIconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  turnoInfo: {
    flex: 1,
  },
  turnoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  turnoTextoSelecionado: {
    color: '#0D6EFD',
  },
  turnoHorario: {
    fontSize: 14,
    color: '#666666',
  },
  turnoHorarioSelecionado: {
    color: '#3479E1',
  },

  // Estilos novos para os horários
  horariosContainer: {
    marginBottom: 20,
  },
  horariosTexto: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  horarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  horarioSelecionado: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  horarioTexto: {
    fontSize: 16,
    color: '#333333',
  },
  horarioTextoSelecionado: {
    color: '#0D6EFD',
    fontWeight: '600',
  },

  tiposContainer: {
    marginBottom: 20,
  },
  tipoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  tipoSelecionado: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  tipoIconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tipoInfo: {
    flex: 1,
  },
  tipoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  tipoTextoSelecionado: {
    color: '#0D6EFD',
  },
  tipoDescricao: {
    fontSize: 14,
    color: '#666666',
  },
  acessibilidadeContainer: {
    marginBottom: 20,
  },
  acessibilidadeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  acessibilidadeSelecionada: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  acessibilidadeIconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  acessibilidadeNome: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  acessibilidadeTextoSelecionado: {
    color: '#0D6EFD',
    fontWeight: '600',
  },
  notificacaoSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificacaoTexto: {
    fontSize: 16,
    color: '#333333',
  },
  canaisContainer: {
    marginBottom: 20,
  },
  canaisTexto: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  canalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  canalSelecionado: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  canalTexto: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
    flex: 1,
  },
})