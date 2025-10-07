import React, { useState, useRef, useEffect } from 'react';
import { Home, Search, PlusCircle, MessageCircle, Users, User, ChevronLeft, LogOut, Send, Trash2, Star, Calendar, Clock } from 'lucide-react';

const MomentsShare = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('home');
  const [chatSubTab, setChatSubTab] = useState('ongoing'); // 'ongoing' or 'past'
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tmModel, setTmModel] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [recognizedData, setRecognizedData] = useState(null);
  const [isManualMode, setIsManualMode] = useState(false);
  
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState('가전제품');
  const [manualDescription, setManualDescription] = useState('');
  const [manualStartDate, setManualStartDate] = useState('');
  const [manualEndDate, setManualEndDate] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [rentalRequests, setRentalRequests] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewToWrite, setReviewToWrite] = useState(null); // {requestId, otherUserId, otherUserName}
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const messagesEndRef = useRef(null);
  
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      type: 'hot',
      title: '효자동 새내기들 환영합니다! 🎓',
      content: '이번에 강원대 입학한 새내기입니다. 동네 분위기도 좋고 필요한 물건들 빌려쓸 수 있어서 정말 좋네요!',
      author: '새내기',
      avatar: '🎓',
      likes: 24,
      comments: 8,
      createdAt: '2시간 전'
    },
    {
      id: 2,
      type: 'interview',
      title: '[인터뷰] 효자동에서 10년째 사는 김영희님',
      content: '저희 동네는 옛날부터 서로 물건도 빌려주고... 요즘 젊은 친구들도 이런 문화에 관심 가져주셔서 감사해요.',
      author: '운영진',
      avatar: '📰',
      likes: 45,
      comments: 12,
      createdAt: '1일 전'
    },
    {
      id: 3,
      type: 'story',
      title: '드라이어 빌려쓰다가 친구 됐어요 💜',
      content: '처음엔 그냥 드라이어 빌리러 갔다가 이야기 나누다 보니 같은 과 선배님이셨어요. 이제 자주 밥도 같이 먹어요!',
      author: '직딩',
      avatar: '💼',
      likes: 67,
      comments: 15,
      createdAt: '3일 전'
    }
  ]);
  
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const categories = ['전체', '가전제품', '주방용품', '스포츠/레저', '전자기기', '생활용품', '공구', '기타'];

  // 스타일 정의
  const styles = {
    container: {
      width: '100%',
      minHeight: '100vh',
      background: '#f3f4f6',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    loginContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      marginBottom: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '0 0 20px 20px',
      marginBottom: '16px'
    },
    navbar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'white',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      borderTop: '1px solid #e5e7eb',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    },
    navItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      border: 'none',
      background: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      padding: '8px 12px',
      fontSize: '11px',
      transition: 'all 0.2s'
    },
    navItemActive: {
      color: '#667eea',
      fontWeight: '600'
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    buttonSecondary: {
      background: '#f3f4f6',
      color: '#374151'
    },
    buttonSuccess: {
      background: '#10b981',
      color: 'white'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    statusAvailable: {
      background: '#d1fae5',
      color: '#065f46',
      padding: '4px 8px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: '600'
    },
    statusRented: {
      background: '#fee2e2',
      color: '#991b1b',
      padding: '4px 8px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: '600'
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600'
    },
    statusPending: {
      background: '#fef3c7',
      color: '#92400e'
    },
    statusApproved: {
      background: '#d1fae5',
      color: '#065f46'
    },
    statusRejected: {
      background: '#fee2e2',
      color: '#991b1b'
    },
    statusCompleted: {
      background: '#e0e7ff',
      color: '#3730a3'
    },
    chatContainer: {
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f3f4f6'
    },
    messagesArea: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    messageRow: {
      display: 'flex',
      justifyContent: 'flex-start'
    },
    messageRowMe: {
      justifyContent: 'flex-end'
    },
    messageContent: {
      display: 'flex',
      gap: '12px',
      maxWidth: '75%'
    },
    messageContentMe: {
      flexDirection: 'row-reverse'
    },
    messageBubble: {
      padding: '14px',
      borderRadius: '16px',
      wordWrap: 'break-word'
    },
    messageBubbleMe: {
      background: '#667eea',
      color: 'white'
    },
    messageBubbleOther: {
      background: 'white',
      color: '#1f2937'
    },
    chatInput: {
      display: 'flex',
      gap: '12px',
      padding: '16px',
      background: 'white',
      borderTop: '1px solid #e5e7eb'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto'
    }
  };

  const initFirebase = async () => {
    if (window.firebaseInitialized) {
      console.log('✅ Firebase 이미 초기화됨');
      setFirebaseReady(true);
      return;
    }
    
    try {
      console.log('🔄 Firebase 초기화 시작...');
      
      await new Promise((resolve, reject) => {
        const script1 = document.createElement('script');
        script1.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
        script1.onload = resolve;
        script1.onerror = reject;
        document.head.appendChild(script1);
      });

      await new Promise((resolve, reject) => {
        const script2 = document.createElement('script');
        script2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
        script2.onload = resolve;
        script2.onerror = reject;
        document.head.appendChild(script2);
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (window.firebase) {
        window.firebase.initializeApp({
          apiKey: "AIzaSyAfTt_v18cCnc975Ir6lrO8RhqNmBqpiQE",
          authDomain: "momentssharetest.firebaseapp.com",
          projectId: "momentssharetest",
          storageBucket: "momentssharetest.firebasestorage.app",
          messagingSenderId: "817582324697",
          appId: "1:817582324697:web:617fbf9c593d2da22c37c8",
          measurementId: "G-94F4Z94NX2"
        });
        window.firebaseInitialized = true;
        console.log('✅ Firebase 초기화 완료');
        
        await initDummyUsers();
        setFirebaseReady(true);
      }
    } catch (error) {
      console.error('❌ Firebase 초기화 실패:', error);
      alert('시스템 초기화에 실패했습니다. 페이지를 새로고침해주세요.');
      setFirebaseReady(false);
    }
  };

  const initDummyUsers = async () => {
    if (!window.firebase || !window.firebaseInitialized) return;
    
    try {
      const db = window.firebase.firestore();
      const usersRef = db.collection('users');
      
      const dummyUsers = [
        { userId: 'user1', username: '새내기', password: 'pass1234', avatar: '🎓' },
        { userId: 'user2', username: '직딩', password: 'pass1234', avatar: '💼' },
        { userId: 'user3', username: '할매', password: 'pass1234', avatar: '👵' },
        { userId: 'user4', username: '학생', password: 'pass1234', avatar: '📚' }
      ];
      
      for (const user of dummyUsers) {
        const userDoc = await usersRef.doc(user.userId).get();
        if (!userDoc.exists) {
          await usersRef.doc(user.userId).set({
            username: user.username,
            password: user.password,
            avatar: user.avatar,
            rating: 0,
            reviewCount: 0,
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      }
      console.log('✅ 더미 사용자 초기화 완료');
    } catch (error) {
      console.error('❌ 더미 사용자 생성 오류:', error);
    }
  };

  const loadUserRating = async (userId) => {
    if (!firebaseReady || !userId) return;
    
    try {
      const db = window.firebase.firestore();
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserRating(userData.rating || 0);
      }
    } catch (error) {
      console.error('평점 로드 오류:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await initFirebase();
      
      const savedUser = localStorage.getItem('ms_currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setCurrentScreen('home');
        await loadUserRating(user.userId);
      }

      const loadTeachableMachine = async () => {
        try {
          await new Promise((resolve, reject) => {
            const script1 = document.createElement('script');
            script1.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js';
            script1.onload = resolve;
            script1.onerror = reject;
            document.head.appendChild(script1);
          });
          
          await new Promise((resolve, reject) => {
            const script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js';
            script2.onload = resolve;
            script2.onerror = reject;
            document.head.appendChild(script2);
          });
          
          const modelURL = 'https://teachablemachine.withgoogle.com/models/w8E_Cqym9/model.json';
          const metadataURL = 'https://teachablemachine.withgoogle.com/models/w8E_Cqym9/metadata.json';
          
          const model = await window.tmImage.load(modelURL, metadataURL);
          setTmModel(model);
          console.log('✅ Teachable Machine 로드 완료');
        } catch (error) {
          console.error('⚠️ TM 로드 실패, 시뮬레이션 모드:', error);
          setTmModel({ ready: true, simulation: true });
        }
      };
      
      loadTeachableMachine();
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (!currentUser || !firebaseReady || !window.firebase || !window.firebaseInitialized) return;

    console.log('🔄 Firebase 리스너 설정 시작');
    const db = window.firebase.firestore();
    
    const unsubscribeItems = db.collection('items')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const loadedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('✅ 아이템 로드됨:', loadedItems.length, '개');
        setItems(loadedItems);
      }, (error) => {
        console.error('❌ 아이템 로드 에러:', error);
      });

    const unsubscribeChatRooms = db.collection('chatRooms')
      .where('participants', 'array-contains', currentUser.userId)
      .onSnapshot((snapshot) => {
        const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        rooms.sort((a, b) => (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0));
        console.log('✅ 채팅방 로드됨:', rooms.length, '개');
        setChatRooms(rooms);
      }, (error) => {
        console.error('❌ 채팅방 로드 에러:', error);
      });

    return () => {
      unsubscribeItems();
      unsubscribeChatRooms();
    };
  }, [currentUser, firebaseReady]);

  useEffect(() => {
    if (!selectedChatRoom || !firebaseReady) return;

    const db = window.firebase.firestore();
    const unsubscribe = db.collection('chatRooms')
      .doc(selectedChatRoom.id)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        setTimeout(() => scrollToBottom(), 100);
      });

    return () => unsubscribe();
  }, [selectedChatRoom?.id, firebaseReady]);

  useEffect(() => {
    if (!currentUser || !firebaseReady || currentScreen !== 'chat') return;

    const db = window.firebase.firestore();
    
    const unsubscribeReceived = db.collection('rentalRequests')
      .where('ownerId', '==', currentUser.userId)
      .onSnapshot((snapshot) => {
        const received = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          type: 'received'
        }));
        
        db.collection('rentalRequests')
          .where('requesterId', '==', currentUser.userId)
          .get()
          .then((snapshot2) => {
            const sent = snapshot2.docs.map(doc => ({ 
              id: doc.id, 
              ...doc.data(),
              type: 'sent'
            }));
            setRentalRequests([...received, ...sent]);
          });
      });

    return () => unsubscribeReceived();
  }, [currentUser, firebaseReady, currentScreen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = async () => {
    console.log('🔄 로그인 시도:', loginId);
    
    if (!loginId || !loginPassword) {
      setLoginError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (!firebaseReady || !window.firebase || !window.firebaseInitialized) {
      setLoginError('시스템 초기화 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const db = window.firebase.firestore();
      const userDoc = await db.collection('users').doc(loginId).get();

      if (!userDoc.exists) {
        setLoginError('존재하지 않는 아이디입니다.');
        return;
      }

      const userData = userDoc.data();
      if (userData.password !== loginPassword) {
        setLoginError('비밀번호가 일치하지 않습니다.');
        return;
      }

      const user = { 
        userId: loginId, 
        username: userData.username,
        avatar: userData.avatar || '👤'
      };
      
      console.log('✅ 로그인 성공:', user.username);
      setCurrentUser(user);
      localStorage.setItem('ms_currentUser', JSON.stringify(user));
      setCurrentScreen('home');
      setActiveTab('home');
      await loadUserRating(loginId);
      
      setLoginId('');
      setLoginPassword('');
      setLoginError('');
    } catch (error) {
      console.error('❌ 로그인 에러:', error);
      setLoginError('로그인 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ms_currentUser');
    setCurrentScreen('login');
    setActiveTab('home');
    setItems([]);
    setUserRating(0);
  };

  const saveItem = async (item) => {
    try {
      if (!window.firebase || !window.firebaseInitialized) {
        alert('Firebase 초기화 중입니다.');
        return null;
      }
      
      const db = window.firebase.firestore();
      const docRef = await db.collection('items').add({
        ...item,
        ownerUserId: currentUser.userId,
        ownerUsername: currentUser.username,
        ownerAvatar: currentUser.avatar,
        status: 'available',
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('✅ 물품 등록 완료:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ 물품 저장 실패:', error);
      alert('물품 저장 실패');
      return null;
    }
  };

  const deleteItem = async (itemId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const db = window.firebase.firestore();
      await db.collection('items').doc(itemId).delete();
      alert('물품이 삭제되었습니다.');
    } catch (error) {
      alert('삭제 실패');
    }
  };

  const analyzeImage = async (imageData) => {
    if (!tmModel) return null;

    setIsProcessing(true);
    
    try {
      if (tmModel.simulation) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const sampleItems = [
          { name: '드라이어', category: '가전제품' },
          { name: '청소기', category: '가전제품' },
          { name: '큰 접시', category: '주방용품' },
          { name: '전기포트', category: '주방용품' },
          { name: '캠핑의자', category: '스포츠/레저' }
        ];
        
        const selected = sampleItems[Math.floor(Math.random() * sampleItems.length)];
        return { 
          name: selected.name, 
          category: selected.category,
          confidence: 0.85 + Math.random() * 0.14
        };
      }
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageData;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const predictions = await tmModel.predict(img);
      const topPrediction = predictions.reduce((max, pred) => 
        pred.probability > max.probability ? pred : max
      );
      
      const itemName = topPrediction.className;
      let detectedCategory = '기타';
      
      const categoryMap = {
        '가전제품': ['드라이어', '청소기'],
        '주방용품': ['큰 접시', '전기포트'],
        '스포츠/레저': ['캠핑의자'],
        '생활용품': ['우산', '책'],
        '공구': ['망치', '몽키스패너', '드라이버']
      };
      
      for (const [category, itemsArr] of Object.entries(categoryMap)) {
        if (itemsArr.some(item => itemName.includes(item))) {
          detectedCategory = category;
          break;
        }
      }
      
      return { 
        name: itemName, 
        category: detectedCategory,
        confidence: topPrediction.probability
      };
      
    } catch (error) {
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploadedImage(reader.result);
      
      const result = await analyzeImage(reader.result);
      if (result) {
        setRecognizedData(result);
        setManualName(result.name);
        setManualCategory(result.category);
      } else {
        setRecognizedData({ error: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRegisterItem = async () => {
    if (isManualMode && !manualName.trim()) {
      alert('물품명을 입력해주세요.');
      return;
    }
    
    if (!manualStartDate || !manualEndDate) {
      alert('대여 가능 기간을 입력해주세요.');
      return;
    }
    
    const newItem = {
      name: isManualMode ? manualName : recognizedData.name,
      category: isManualMode ? manualCategory : recognizedData.category,
      image: uploadedImage,
      description: manualDescription || '설명 없음',
      startDate: manualStartDate,
      endDate: manualEndDate
    };
    
    const itemId = await saveItem(newItem);
    
    if (itemId) {
      alert('물품이 등록되었습니다!');
      setUploadedImage(null);
      setRecognizedData(null);
      setIsManualMode(false);
      setManualName('');
      setManualCategory('가전제품');
      setManualDescription('');
      setManualStartDate('');
      setManualEndDate('');
      setCurrentScreen('home');
      setActiveTab('home');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCurrentScreen('itemDetail');
  };

  const requestRental = async (item) => {
    if (!firebaseReady) {
      alert('시스템 초기화 중입니다.');
      return;
    }

    const db = window.firebase.firestore();
    
    try {
      const existingRequest = await db.collection('rentalRequests')
        .where('itemId', '==', item.id)
        .where('requesterId', '==', currentUser.userId)
        .where('status', 'in', ['pending', 'approved'])
        .get();

      if (!existingRequest.empty) {
        alert('이미 대여 요청을 보냈습니다.');
        return;
      }

      await db.collection('rentalRequests').add({
        itemId: item.id,
        itemName: item.name,
        itemImage: item.image,
        requesterId: currentUser.userId,
        requesterName: currentUser.username,
        requesterAvatar: currentUser.avatar,
        ownerId: item.ownerUserId,
        ownerName: item.ownerUsername,
        status: 'pending',
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });

      alert('대여 요청을 보냈습니다! 채팅 탭에서 확인하세요.');
      setCurrentScreen('chat');
      setActiveTab('chat');
    } catch (error) {
      console.error('대여 요청 오류:', error);
      alert('대여 요청 중 오류가 발생했습니다.');
    }
  };

  const startChat = async (item) => {
    if (!firebaseReady) return;

    const db = window.firebase.firestore();
    
    try {
      const existingRoom = await db.collection('chatRooms')
        .where('itemId', '==', item.id)
        .where('participants', 'array-contains', currentUser.userId)
        .get();

      let chatRoomId;

      if (!existingRoom.empty) {
        chatRoomId = existingRoom.docs[0].id;
        const roomData = { id: chatRoomId, ...existingRoom.docs[0].data() };
        setSelectedChatRoom(roomData);
      } else {
        const newRoom = await db.collection('chatRooms').add({
          itemId: item.id,
          itemName: item.name,
          itemImage: item.image,
          participants: [currentUser.userId, item.ownerUserId],
          participantsInfo: {
            [currentUser.userId]: {
              username: currentUser.username,
              avatar: currentUser.avatar
            },
            [item.ownerUserId]: {
              username: item.ownerUsername,
              avatar: item.ownerAvatar
            }
          },
          lastMessage: '',
          lastMessageAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
        
        chatRoomId = newRoom.id;
        const roomData = await db.collection('chatRooms').doc(chatRoomId).get();
        setSelectedChatRoom({ id: chatRoomId, ...roomData.data() });
      }

      setCurrentScreen('chatDetail');
      setActiveTab('chat');
    } catch (error) {
      console.error('채팅 시작 오류:', error);
      alert('채팅 시작 중 오류가 발생했습니다.');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChatRoom || !firebaseReady) return;

    const db = window.firebase.firestore();
    
    try {
      await db.collection('chatRooms')
        .doc(selectedChatRoom.id)
        .collection('messages')
        .add({
          text: newMessage,
          senderId: currentUser.userId,
          senderName: currentUser.username,
          senderAvatar: currentUser.avatar,
          createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });

      await db.collection('chatRooms').doc(selectedChatRoom.id).update({
        lastMessage: newMessage,
        lastMessageAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    }
  };

  const approveRental = async (requestId, request) => {
    if (!firebaseReady) return;

    const db = window.firebase.firestore();
    
    try {
      await db.collection('rentalRequests').doc(requestId).update({
        status: 'approved',
        approvedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });

      await db.collection('items').doc(request.itemId).update({
        status: 'rented',
        rentedTo: request.requesterId,
        rentedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });

      alert('대여를 승인했습니다!');
    } catch (error) {
      console.error('대여 승인 오류:', error);
      alert('대여 승인 중 오류가 발생했습니다.');
    }
  };

  const rejectRental = async (requestId) => {
    if (!firebaseReady) return;

    const db = window.firebase.firestore();
    
    try {
      await db.collection('rentalRequests').doc(requestId).update({
        status: 'rejected',
        rejectedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });

      alert('대여 요청을 거절했습니다.');
    } catch (error) {
      console.error('대여 거절 오류:', error);
      alert('대여 거절 중 오류가 발생했습니다.');
    }
  };

  const completeRental = async (requestId, request) => {
    if (!firebaseReady) return;

    const db = window.firebase.firestore();
    
    try {
      await db.collection('rentalRequests').doc(requestId).update({
        status: 'completed',
        completedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });

      await db.collection('items').doc(request.itemId).update({
        status: 'available',
        rentedTo: null
      });

      // 평가 작성 유도
      const otherUserId = request.type === 'received' ? request.requesterId : request.ownerId;
      const otherUserName = request.type === 'received' ? request.requesterName : request.ownerName;
      
      setReviewToWrite({
        requestId: requestId,
        otherUserId: otherUserId,
        otherUserName: otherUserName,
        itemName: request.itemName
      });

      alert('대여가 완료되었습니다! 상대방에 대한 평가를 남겨주세요.');
    } catch (error) {
      console.error('대여 완료 오류:', error);
      alert('대여 완료 중 오류가 발생했습니다.');
    }
  };

  const submitReview = async () => {
    if (!reviewToWrite || !firebaseReady) return;
    
    if (!reviewComment.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    const db = window.firebase.firestore();
    
    try {
      // 리뷰 저장
      await db.collection('reviews').add({
        requestId: reviewToWrite.requestId,
        reviewerId: currentUser.userId,
        reviewerName: currentUser.username,
        reviewedUserId: reviewToWrite.otherUserId,
        rating: reviewRating,
        comment: reviewComment,
        itemName: reviewToWrite.itemName,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });

      // 사용자 평점 업데이트
      const userDoc = await db.collection('users').doc(reviewToWrite.otherUserId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const currentRating = userData.rating || 0;
        const currentCount = userData.reviewCount || 0;
        const newCount = currentCount + 1;
        const newRating = ((currentRating * currentCount) + reviewRating) / newCount;
        
        await db.collection('users').doc(reviewToWrite.otherUserId).update({
          rating: newRating,
          reviewCount: newCount
        });
      }

      alert('리뷰가 등록되었습니다!');
      setReviewToWrite(null);
      setReviewRating(5);
      setReviewComment('');
      
      // 내 평점도 새로고침
      await loadUserRating(currentUser.userId);
    } catch (error) {
      console.error('리뷰 등록 오류:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ongoingRequests = rentalRequests.filter(r => ['pending', 'approved'].includes(r.status));
  const pastRequests = rentalRequests.filter(r => ['completed', 'rejected'].includes(r.status));

  // 로그인 화면
  if (currentScreen === 'login') {
    return (
      <div style={styles.loginContainer}>
        <div style={{...styles.card, padding: '32px', width: '100%', maxWidth: '400px'}}>
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <div style={{fontSize: '60px', marginBottom: '16px'}}>🤝</div>
            <h1 style={{fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', margin: 0}}>모먼츠쉐어</h1>
            <p style={{color: '#6b7280', margin: '8px 0 0 0'}}>이웃과 함께하는 공유 플랫폼</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>아이디</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="user1"
                style={styles.input}
              />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>비밀번호</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="pass1234"
                style={styles.input}
              />
            </div>
            {loginError && (
              <div style={{background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', fontSize: '14px', color: '#b91c1c'}}>
                {loginError}
              </div>
            )}
            <button 
              onClick={handleLogin} 
              disabled={!firebaseReady}
              style={{...styles.button, ...styles.buttonPrimary, opacity: firebaseReady ? 1 : 0.5}}
            >
              {firebaseReady ? '로그인' : '시스템 초기화 중...'}
            </button>
            <div style={{background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', padding: '16px'}}>
              <p style={{fontSize: '14px', fontWeight: '600', color: '#1e3a8a', marginBottom: '8px', margin: '0 0 8px 0'}}>💡 테스트 계정</p>
              <div style={{fontSize: '12px', color: '#1e40af'}}>
                <p style={{margin: 0}}>user1 ~ user4 / pass1234</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 네비게이션 바
  const NavBar = () => (
    <div style={styles.navbar}>
      {[
        { id: 'home', icon: Home, label: '홈' },
        { id: 'search', icon: Search, label: '검색' },
        { id: 'register', icon: PlusCircle, label: '등록' },
        { id: 'chat', icon: MessageCircle, label: '채팅' },
        { id: 'community', icon: Users, label: '커뮤니티' },
        { id: 'mypage', icon: User, label: 'MY' }
      ].map(({ id, icon: Icon, label }) => (
        <button 
          key={id} 
          onClick={() => { 
            console.log('🔘 탭 클릭:', id);
            setCurrentScreen(id); 
            setActiveTab(id); 
          }}
          style={{
            ...styles.navItem,
            ...(activeTab === id ? styles.navItemActive : {})
          }}
        >
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );

  // 리뷰 작성 모달
  const ReviewModal = () => {
    if (!reviewToWrite) return null;

    return (
      <div style={styles.modal} onClick={() => {
        setReviewToWrite(null);
        setReviewRating(5);
        setReviewComment('');
      }}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px'}}>공유 평가하기</h2>
          
          <div style={{marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '12px'}}>
            <p style={{fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0'}}>물품</p>
            <p style={{fontSize: '16px', fontWeight: '600', margin: 0}}>{reviewToWrite.itemName}</p>
            <p style={{fontSize: '14px', color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0'}}>상대방</p>
            <p style={{fontSize: '16px', fontWeight: '600', margin: 0}}>{reviewToWrite.otherUserName}</p>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>평점</label>
            <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '32px',
                    padding: '4px'
                  }}
                >
                  <Star 
                    size={36} 
                    fill={star <= reviewRating ? '#fbbf24' : 'none'}
                    color={star <= reviewRating ? '#fbbf24' : '#d1d5db'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>리뷰</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="공유 경험을 알려주세요"
              style={{...styles.input, minHeight: '120px', resize: 'vertical'}}
            />
          </div>

          <div style={{display: 'flex', gap: '12px'}}>
            <button
              onClick={() => {
                setReviewToWrite(null);
                setReviewRating(5);
                setReviewComment('');
              }}
              style={{...styles.button, ...styles.buttonSecondary, flex: 1}}
            >
              나중에
            </button>
            <button
              onClick={submitReview}
              style={{...styles.button, ...styles.buttonPrimary, flex: 1}}
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 홈 화면
  if (currentScreen === 'home') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <span style={{fontSize: '40px'}}>{currentUser?.avatar}</span>
              <div>
                <span style={{fontSize: '14px', opacity: 0.9}}>안녕하세요,</span>
                <p style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>{currentUser?.username}님</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px'}}>
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <span style={{fontSize: '13px', opacity: 0.9}}>{userRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <button onClick={handleLogout} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>
              <LogOut size={24} />
            </button>
          </div>
          <h1 style={{fontSize: '26px', fontWeight: 'bold', margin: 0}}>모먼츠쉐어</h1>
        </div>

        <div style={{padding: '20px'}}>
          {/* 커뮤니티 섹션 */}
          <div style={{marginBottom: '32px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>🔥 동네 이야기</h2>
              <button 
                onClick={() => { setCurrentScreen('community'); setActiveTab('community'); }}
                style={{background: 'none', border: 'none', color: '#667eea', fontSize: '15px', cursor: 'pointer', fontWeight: '600'}}
              >
                더보기 →
              </button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {communityPosts.slice(0, 2).map(post => (
                <div 
                  key={post.id}
                  onClick={() => { setCurrentScreen('community'); setActiveTab('community'); }}
                  style={{...styles.card, padding: '20px', cursor: 'pointer'}}
                >
                  <div style={{display: 'flex', alignItems: 'start', gap: '16px'}}>
                    <span style={{fontSize: '40px'}}>{post.avatar}</span>
                    <div style={{flex: 1}}>
                      <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: '0 0 6px 0'}}>{post.title}</h3>
                      <p style={{fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        {post.content}
                      </p>
                      <div style={{display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#9ca3af'}}>
                        <span>{post.author}</span>
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 공유물품 섹션 */}
          <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px'}}>등록된 공유물품 ({items.length}개)</h2>
          
          {!firebaseReady ? (
            <div style={{...styles.card, padding: '40px', textAlign: 'center', color: '#6b7280'}}>
              <p>시스템을 초기화하고 있습니다...</p>
            </div>
          ) : items.length === 0 ? (
            <div style={{...styles.card, padding: '40px', textAlign: 'center', color: '#6b7280'}}>
              <p style={{margin: '0 0 8px 0'}}>등록된 물품이 없습니다.</p>
              <p style={{fontSize: '14px', margin: 0}}>하단의 등록 버튼을 눌러 물품을 등록해보세요!</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{...styles.card, cursor: 'pointer'}}
                >
                  <div style={{display: 'flex', gap: '16px', padding: '16px'}}>
                    <div style={{position: 'relative', width: '110px', height: '110px', flexShrink: 0}}>
                      <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
                      <div style={{
                        ...(item.status === 'rented' ? styles.statusRented : styles.statusAvailable),
                        position: 'absolute', 
                        top: '6px', 
                        right: '6px'
                      }}>
                        {item.status === 'rented' ? '대여중' : '대여가능'}
                      </div>
                    </div>
                    
                    <div style={{flex: 1, minWidth: 0}}>
                      <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 6px 0'}}>{item.name}</h3>
                      <span style={{display: 'inline-block', background: '#fed7aa', color: '#ea580c', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', marginBottom: '10px'}}>
                        {item.category}
                      </span>
                      <div style={{display: 'flex', alignItems: 'center', fontSize: '13px', color: '#6b7280', marginBottom: '6px'}}>
                        <span style={{marginRight: '6px'}}>{item.ownerAvatar}</span>
                        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{item.ownerUsername}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <NavBar />
        <ReviewModal />
      </div>
    );
  }

  // 검색 화면
  if (currentScreen === 'search') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{fontSize: '22px', fontWeight: 'bold', margin: 0}}>검색</h2>
        </div>
        <div style={{padding: '20px'}}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="물품 검색..."
            style={{...styles.input, marginBottom: '20px'}}
          />
          
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px'}}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '24px',
                  border: selectedCategory === cat ? '2px solid #667eea' : '1px solid #d1d5db',
                  background: selectedCategory === cat ? '#ede9fe' : 'white',
                  color: selectedCategory === cat ? '#667eea' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: selectedCategory === cat ? '600' : '400'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px'}}>검색 결과 ({filteredItems.length}개)</h3>
          
          {filteredItems.length === 0 ? (
            <div style={{...styles.card, padding: '40px', textAlign: 'center', color: '#6b7280'}}>
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{...styles.card, cursor: 'pointer'}}
                >
                  <div style={{display: 'flex', gap: '16px', padding: '16px'}}>
                    <img src={item.image} alt={item.name} style={{width: '90px', height: '90px', objectFit: 'cover', borderRadius: '12px'}} />
                    <div style={{flex: 1}}>
                      <h3 style={{fontSize: '17px', fontWeight: 'bold', margin: '0 0 6px 0'}}>{item.name}</h3>
                      <p style={{fontSize: '13px', color: '#6b7280', margin: '0 0 10px 0'}}>{item.category}</p>
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                        <span>{item.ownerAvatar}</span>
                        <span style={{fontSize: '13px'}}>{item.ownerUsername}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <NavBar />
      </div>
    );
  }

  // 등록 화면
  if (currentScreen === 'register') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{fontSize: '22px', fontWeight: 'bold', margin: 0}}>물품 등록</h2>
        </div>
        <div style={{padding: '20px'}}>
          {!uploadedImage ? (
            <div style={{...styles.card, padding: '40px', textAlign: 'center'}}>
              <p style={{marginBottom: '20px', color: '#6b7280', fontSize: '15px'}}>공유할 물품의 사진을 촬영하거나 업로드해주세요</p>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                style={{display: 'none'}}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{display: 'none'}}
              />
              <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  style={{...styles.button, ...styles.buttonPrimary, padding: '16px'}}
                >
                  📷 카메라로 촬영
                </button>
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  style={{...styles.button, ...styles.buttonSecondary, padding: '16px'}}
                >
                  🖼️ 갤러리에서 선택
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{...styles.card, padding: '20px', marginBottom: '20px'}}>
                <img src={uploadedImage} alt="업로드된 이미지" style={{width: '100%', borderRadius: '12px'}} />
              </div>

              {isProcessing ? (
                <div style={{...styles.card, padding: '40px', textAlign: 'center'}}>
                  <p style={{fontSize: '15px'}}>AI가 물품을 분석중입니다...</p>
                </div>
              ) : recognizedData && !recognizedData.error ? (
                <div style={{...styles.card, padding: '20px'}}>
                  <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '20px'}}>
                    {isManualMode ? '직접 입력' : 'AI 인식 결과'}
                  </h3>
                  
                  {!isManualMode && recognizedData.confidence && (
                    <div style={{marginBottom: '20px', padding: '14px', background: '#f0fdf4', borderRadius: '10px'}}>
                      <p style={{fontSize: '15px', color: '#065f46', margin: 0}}>
                        AI 정확도: {(recognizedData.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                  
                  <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '10px'}}>물품명</label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      disabled={!isManualMode}
                      style={styles.input}
                    />
                  </div>

                  <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '10px'}}>카테고리</label>
                    <select
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value)}
                      disabled={!isManualMode}
                      style={styles.input}
                    >
                      {categories.filter(c => c !== '전체').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '10px'}}>설명</label>
                    <textarea
                      value={manualDescription}
                      onChange={(e) => setManualDescription(e.target.value)}
                      placeholder="물품에 대한 설명을 입력해주세요"
                      style={{...styles.input, minHeight: '100px'}}
                    />
                  </div>

                  <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '10px'}}>
                      <Calendar size={18} style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}} />
                      대여 시작일시
                    </label>
                    <input
                      type="datetime-local"
                      value={manualStartDate}
                      onChange={(e) => setManualStartDate(e.target.value)}
                      style={styles.input}
                    />
                  </div>

                  <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '10px'}}>
                      <Clock size={18} style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}} />
                      대여 종료일시
                    </label>
                    <input
                      type="datetime-local"
                      value={manualEndDate}
                      onChange={(e) => setManualEndDate(e.target.value)}
                      style={styles.input}
                    />
                  </div>

                  <button
                    onClick={() => setIsManualMode(!isManualMode)}
                    style={{...styles.button, ...styles.buttonSecondary, marginBottom: '10px'}}
                  >
                    {isManualMode ? '✨ AI 인식으로 전환' : '✏️ 직접 수정'}
                  </button>

                  <button
                    onClick={handleRegisterItem}
                    style={{...styles.button, ...styles.buttonPrimary}}
                  >
                    등록하기
                  </button>
                </div>
              ) : (
                <div style={{...styles.card, padding: '40px', textAlign: 'center'}}>
                  <p style={{marginBottom: '20px', color: '#ef4444', fontSize: '15px'}}>AI 인식에 실패했습니다</p>
                  <button
                    onClick={() => {
                      setIsManualMode(true);
                      setRecognizedData({ name: '', category: '가전제품' });
                    }}
                    style={{...styles.button, ...styles.buttonSecondary}}
                  >
                    직접 입력하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <NavBar />
      </div>
    );
  }

  // 마이페이지
  if (currentScreen === 'mypage') {
    const myItems = items.filter(item => item.ownerUserId === currentUser?.userId);
    const rentedItems = items.filter(item => item.rentedTo === currentUser?.userId);

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{fontSize: '22px', fontWeight: 'bold', margin: 0}}>마이페이지</h2>
        </div>
        <div style={{padding: '20px'}}>
          <div style={{...styles.card, padding: '30px', marginBottom: '20px'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '70px', marginBottom: '16px'}}>{currentUser?.avatar}</div>
              <h3 style={{fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0'}}>{currentUser?.username}</h3>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px'}}>
                <Star size={20} fill="#fbbf24" color="#fbbf24" />
                <span style={{fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{userRating.toFixed(1)}</span>
              </div>
              <p style={{fontSize: '14px', color: '#6b7280', marginTop: '8px'}}>최소한의 정보로 안전하게</p>
            </div>
          </div>
          
          <div style={{...styles.card, padding: '20px', marginBottom: '20px'}}>
            <h4 style={{fontWeight: 'bold', marginBottom: '16px', fontSize: '17px'}}>내가 등록한 물품 ({myItems.length}개)</h4>
            {myItems.length === 0 ? (
              <p style={{fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '20px'}}>등록한 물품이 없습니다</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {myItems.map(item => (
                  <div 
                    key={item.id} 
                    style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '10px', background: '#f9fafb'}}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer'}} 
                      onClick={() => handleItemClick(item)}
                    />
                    <div style={{flex: 1, cursor: 'pointer'}} onClick={() => handleItemClick(item)}>
                      <p style={{fontWeight: '600', fontSize: '15px', margin: '0 0 4px 0'}}>{item.name}</p>
                      <p style={{fontSize: '13px', color: '#6b7280', margin: '0 0 6px 0'}}>{item.category}</p>
                      <span style={{
                        ...(item.status === 'rented' ? styles.statusRented : styles.statusAvailable),
                        fontSize: '11px',
                        padding: '3px 8px'
                      }}>
                        {item.status === 'rented' ? '대여중' : '대여가능'}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer'}}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{...styles.card, padding: '20px', marginBottom: '20px'}}>
            <h4 style={{fontWeight: 'bold', marginBottom: '16px', fontSize: '17px'}}>내가 대여중인 물품 ({rentedItems.length}개)</h4>
            {rentedItems.length === 0 ? (
              <p style={{fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '20px'}}>대여중인 물품이 없습니다</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {rentedItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => handleItemClick(item)}
                    style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '10px', cursor: 'pointer', background: '#f9fafb'}}
                  >
                    <img src={item.image} alt={item.name} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px'}} />
                    <div style={{flex: 1}}>
                      <p style={{fontWeight: '600', fontSize: '15px', margin: '0 0 4px 0'}}>{item.name}</p>
                      <p style={{fontSize: '13px', color: '#6b7280', margin: 0}}>{item.ownerUsername}님의 물품</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleLogout}
            style={{...styles.button, ...styles.buttonSecondary, padding: '16px'}}
          >
            <LogOut size={22} />
            로그아웃
          </button>
        </div>
        <NavBar />
      </div>
    );
  }

  // 채팅 화면
  if (currentScreen === 'chat') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{fontSize: '22px', fontWeight: 'bold', margin: '0 0 16px 0'}}>대여 요청 & 채팅</h2>
          
          {/* 서브탭 */}
          <div style={{display: 'flex', gap: '12px'}}>
            <button
              onClick={() => setChatSubTab('ongoing')}
              style={{
                flex: 1,
                padding: '10px',
                background: chatSubTab === 'ongoing' ? 'white' : 'transparent',
                color: chatSubTab === 'ongoing' ? '#667eea' : 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              진행중
            </button>
            <button
              onClick={() => setChatSubTab('past')}
              style={{
                flex: 1,
                padding: '10px',
                background: chatSubTab === 'past' ? 'white' : 'transparent',
                color: chatSubTab === 'past' ? '#667eea' : 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              지난 공유
            </button>
          </div>
        </div>
        
        <div style={{padding: '20px'}}>
          {chatSubTab === 'ongoing' ? (
            <>
              <h3 style={{fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>대여 요청</h3>
              {ongoingRequests.length === 0 ? (
                <div style={{...styles.card, padding: '20px', textAlign: 'center', color: '#6b7280', marginBottom: '24px'}}>
                  <p style={{fontSize: '14px', margin: 0}}>진행중인 대여 요청이 없습니다.</p>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px'}}>
                  {ongoingRequests.map((request) => (
                    <div key={request.id} style={{...styles.card, padding: '20px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px'}}>
                        <img src={request.itemImage} alt={request.itemName} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px'}} />
                        <div style={{flex: 1}}>
                          <h4 style={{fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0'}}>{request.itemName}</h4>
                          <p style={{fontSize: '13px', color: '#6b7280', margin: 0}}>
                            {request.type === 'received' ? `${request.requesterAvatar} ${request.requesterName}님이 요청` : `${request.ownerName}님에게 요청`}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(request.status === 'pending' ? styles.statusPending : styles.statusApproved)
                        }}>
                          {request.status === 'pending' && '대기중'}
                          {request.status === 'approved' && '승인됨'}
                        </span>
                        
                        {request.type === 'received' && request.status === 'pending' && (
                          <div style={{display: 'flex', gap: '10px'}}>
                            <button
                              onClick={() => rejectRental(request.id)}
                              style={{
                                ...styles.button,
                                ...styles.buttonSecondary,
                                padding: '8px 16px',
                                fontSize: '13px',
                                width: 'auto'
                              }}
                            >
                              거절
                            </button>
                            <button
                              onClick={() => approveRental(request.id, request)}
                              style={{
                                ...styles.button,
                                ...styles.buttonSuccess,
                                padding: '8px 16px',
                                fontSize: '13px',
                                width: 'auto'
                              }}
                            >
                              승인
                            </button>
                          </div>
                        )}
                        
                        {request.type === 'received' && request.status === 'approved' && (
                          <button
                            onClick={() => completeRental(request.id, request)}
                            style={{
                              ...styles.button,
                              ...styles.buttonPrimary,
                              padding: '8px 16px',
                              fontSize: '13px',
                              width: 'auto'
                            }}
                          >
                            반납완료
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 style={{fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>채팅방</h3>
              {chatRooms.length === 0 ? (
                <div style={{...styles.card, padding: '20px', textAlign: 'center', color: '#6b7280'}}>
                  <MessageCircle style={{margin: '0 auto 12px'}} size={52} />
                  <p style={{fontSize: '14px', margin: 0}}>진행 중인 채팅이 없습니다.</p>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {chatRooms.map((room) => {
                    const otherUserId = room.participants.find(id => id !== currentUser.userId);
                    const otherUser = room.participantsInfo[otherUserId];
                    
                    return (
                      <div
                        key={room.id}
                        onClick={() => {
                          setSelectedChatRoom(room);
                          setCurrentScreen('chatDetail');
                        }}
                        style={{...styles.card, padding: '20px', cursor: 'pointer'}}
                      >
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                          <img src={room.itemImage} alt={room.itemName} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px'}} />
                          <div style={{flex: 1}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
                              <span style={{fontSize: '22px'}}>{otherUser?.avatar}</span>
                              <h3 style={{fontWeight: 'bold', fontSize: '16px', margin: 0}}>{otherUser?.username}</h3>
                            </div>
                            <p style={{fontSize: '13px', color: '#6b7280', marginBottom: '6px', margin: '0 0 6px 0'}}>{room.itemName}</p>
                            <p style={{fontSize: '13px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0}}>{room.lastMessage || '새 채팅'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <h3 style={{fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>지난 공유</h3>
              {pastRequests.length === 0 ? (
                <div style={{...styles.card, padding: '20px', textAlign: 'center', color: '#6b7280'}}>
                  <p style={{fontSize: '14px', margin: 0}}>지난 공유 내역이 없습니다.</p>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {pastRequests.map((request) => (
                    <div key={request.id} style={{...styles.card, padding: '20px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px'}}>
                        <img src={request.itemImage} alt={request.itemName} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px'}} />
                        <div style={{flex: 1}}>
                          <h4 style={{fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0'}}>{request.itemName}</h4>
                          <p style={{fontSize: '13px', color: '#6b7280', margin: 0}}>
                            {request.type === 'received' ? `${request.requesterAvatar} ${request.requesterName}님` : `${request.ownerName}님`}
                          </p>
                        </div>
                        <span style={{
                          ...styles.statusBadge,
                          ...(request.status === 'completed' ? styles.statusCompleted : styles.statusRejected)
                        }}>
                          {request.status === 'completed' && '완료됨'}
                          {request.status === 'rejected' && '거절됨'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <NavBar />
        <ReviewModal />
      </div>
    );
  }

  // 채팅 상세 화면
  if (currentScreen === 'chatDetail' && selectedChatRoom) {
    const otherUserId = selectedChatRoom.participants.find(id => id !== currentUser.userId);
    const otherUser = selectedChatRoom.participantsInfo[otherUserId];

    return (
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <button 
              onClick={() => {
                setCurrentScreen('chat');
                setSelectedChatRoom(null);
                setMessages([]);
              }} 
              style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '16px'}}
            >
              <ChevronLeft size={26} />
            </button>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
              <span style={{fontSize: '28px'}}>{otherUser?.avatar}</span>
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>{otherUser?.username}</h2>
                <p style={{fontSize: '13px', opacity: 0.9, margin: 0}}>{selectedChatRoom.itemName}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.messagesArea}>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.userId;
            return (
              <div key={msg.id} style={{
                ...styles.messageRow,
                ...(isMe ? styles.messageRowMe : {})
              }}>
                <div style={{
                  ...styles.messageContent,
                  ...(isMe ? styles.messageContentMe : {})
                }}>
                  <span style={{fontSize: '28px'}}>{msg.senderAvatar}</span>
                  <div>
                    <div style={{
                      ...styles.messageBubble,
                      ...(isMe ? styles.messageBubbleMe : styles.messageBubbleOther)
                    }}>
                      <p style={{fontSize: '15px', margin: 0, lineHeight: '1.5'}}>{msg.text}</p>
                    </div>
                    <p style={{fontSize: '12px', color: '#6b7280', marginTop: '6px', margin: '6px 0 0 0'}}>
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '전송중'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.chatInput}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="메시지를 입력하세요..."
            style={{...styles.input, flex: 1, margin: 0}}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              padding: '14px 28px',
              width: 'auto',
              opacity: newMessage.trim() ? 1 : 0.5
            }}
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    );
  }

  // 물품 상세 화면
  if (currentScreen === 'itemDetail' && selectedItem) {
    const isMyItem = selectedItem.ownerUserId === currentUser?.userId;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button 
            onClick={() => {
              setCurrentScreen('home');
              setSelectedItem(null);
            }} 
            style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginBottom: '10px'}}
          >
            <ChevronLeft size={26} />
          </button>
          <h2 style={{fontSize: '22px', fontWeight: 'bold', margin: 0}}>물품 상세</h2>
        </div>

        <div style={{padding: '20px'}}>
          <div style={{...styles.card, padding: 0, marginBottom: '20px'}}>
            <img src={selectedItem.image} alt={selectedItem.name} style={{width: '100%', height: '350px', objectFit: 'cover', borderRadius: '16px 16px 0 0'}} />
            <div style={{padding: '24px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px'}}>
                <div style={{flex: 1}}>
                  <h2 style={{fontSize: '26px', fontWeight: 'bold', margin: '0 0 10px 0'}}>{selectedItem.name}</h2>
                  <span style={{display: 'inline-block', background: '#fed7aa', color: '#ea580c', padding: '6px 14px', borderRadius: '8px', fontSize: '15px'}}>
                    {selectedItem.category}
                  </span>
                </div>
                <span style={selectedItem.status === 'rented' ? styles.statusRented : styles.statusAvailable}>
                  {selectedItem.status === 'rented' ? '대여중' : '대여가능'}
                </span>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '12px'}}>
                <span style={{fontSize: '40px'}}>{selectedItem.ownerAvatar}</span>
                <div>
                  <p style={{fontWeight: '600', fontSize: '16px', margin: 0}}>{selectedItem.ownerUsername}</p>
                  <p style={{fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0'}}>물품 제공자</p>
                </div>
              </div>

              <div style={{marginBottom: '20px'}}>
                <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#6b7280'}}>설명</h3>
                <p style={{fontSize: '15px', lineHeight: '1.7', margin: 0}}>{selectedItem.description}</p>
              </div>

              {selectedItem.startDate && selectedItem.endDate && (
                <div style={{marginBottom: '20px', padding: '16px', background: '#f0f9ff', borderRadius: '12px'}}>
                  <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#0369a1'}}>대여 가능 기간</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                    <p style={{fontSize: '14px', margin: 0}}>
                      <Calendar size={16} style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}} />
                      시작: {new Date(selectedItem.startDate).toLocaleString('ko-KR')}
                    </p>
                    <p style={{fontSize: '14px', margin: 0}}>
                      <Clock size={16} style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}} />
                      종료: {new Date(selectedItem.endDate).toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              )}

              {!isMyItem && selectedItem.status === 'available' && (
                <div style={{display: 'flex', gap: '12px'}}>
                  <button
                    onClick={() => startChat(selectedItem)}
                    style={{
                      ...styles.button,
                      ...styles.buttonSecondary,
                      flex: 1,
                      padding: '16px'
                    }}
                  >
                    <MessageCircle size={22} />
                    채팅하기
                  </button>
                  <button
                    onClick={() => requestRental(selectedItem)}
                    style={{
                      ...styles.button,
                      ...styles.buttonPrimary,
                      flex: 1,
                      padding: '16px'
                    }}
                  >
                    대여 요청
                  </button>
                </div>
              )}

              {isMyItem && (
                <button
                  onClick={() => deleteItem(selectedItem.id)}
                  style={{
                    ...styles.button,
                    background: '#ef4444',
                    color: 'white',
                    padding: '16px'
                  }}
                >
                  <Trash2 size={22} />
                  물품 삭제
                </button>
              )}
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  // 커뮤니티 화면
  if (currentScreen === 'community') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{fontSize: '22px', fontWeight: 'bold', margin: 0}}>커뮤니티</h2>
        </div>
        <div style={{padding: '20px'}}>
          {communityPosts.map((post) => (
            <div key={post.id} style={{...styles.card, padding: '24px', marginBottom: '16px'}}>
              <div style={{display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '16px'}}>
                <span style={{fontSize: '46px'}}>{post.avatar}</span>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
                    <span style={{fontWeight: 'bold', fontSize: '16px'}}>{post.author}</span>
                    {post.type === 'hot' && <span style={{background: '#fee2e2', color: '#dc2626', padding: '3px 10px', borderRadius: '14px', fontSize: '12px', fontWeight: '600'}}>🔥 HOT</span>}
                    {post.type === 'interview' && <span style={{background: '#dbeafe', color: '#2563eb', padding: '3px 10px', borderRadius: '14px', fontSize: '12px', fontWeight: '600'}}>📰 인터뷰</span>}
                  </div>
                  <span style={{fontSize: '13px', color: '#9ca3af'}}>{post.createdAt}</span>
                </div>
              </div>
              
              <h3 style={{fontSize: '19px', fontWeight: 'bold', margin: '0 0 10px 0'}}>{post.title}</h3>
              <p style={{fontSize: '15px', color: '#4b5563', lineHeight: '1.7', margin: '0 0 20px 0'}}>{post.content}</p>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6'}}>
                <button style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '15px'}}>
                  ❤️ {post.likes}
                </button>
                <button style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '15px'}}>
                  💬 {post.comments}
                </button>
                <button style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '15px'}}>
                  📤 공유
                </button>
              </div>
            </div>
          ))}
        </div>
        <NavBar />
      </div>
    );
  }

  return null;
};

export default MomentsShare;