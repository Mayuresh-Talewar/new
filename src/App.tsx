import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Clipboard } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ChevronDown, ChevronUp, Play, Copy, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/Colors';
import { ArtifactData } from '@/utils/DevAssistant/DevAssistant';

// Token color palette
const TOKEN_COLORS = {
  keyword: '#c792ea', type: '#82aaff', string: '#c3e88d', number: '#f78c6c',
  comment: '#546e7a', jsxTag: '#f07178', jsxAttr: '#ffcb6b', brace: '#89ddff',
  paren: '#82aaff', bracket: '#c792ea', operator: '#89ddff', punctuation: '#bfc7d5',
  plain: '#d4d4d4',
} as const;

const KEYWORDS = new Set(['const', 'let', 'var', 'function', 'return', 'import', 'export', 'default', 'from', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'class', 'extends', 'new', 'this', 'super', 'typeof', 'instanceof', 'in', 'of', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'null', 'undefined', 'true', 'false', 'type', 'interface', 'enum', 'implements', 'abstract', 'static', 'public', 'private', 'protected', 'readonly', 'void', 'never', 'any', 'unknown', 'as', 'keyof', 'typeof']);
const TYPES = new Set(['React', 'string', 'number', 'boolean', 'object', 'Array', 'Promise', 'ReactNode', 'FC', 'useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'useContext', 'useReducer', 'View', 'Text', 'Image', 'TouchableOpacity', 'ScrollView', 'StyleSheet']);

// Tokenizer
function tokenize(code: string) {
  const tokens = [];
  let i = 0;
  while (i < code.length) {
    if (code[i] === '/' && (code[i + 1] === '/' || code[i + 1] === '*')) {
      const end = code[i + 1] === '/' ? code.indexOf('\n', i) : code.indexOf('*/', i + 2);
      const value = end === -1 ? code.slice(i) : code.slice(i, end + (code[i + 1] === '*' ? 2 : 0));
      tokens.push({ type: 'comment', value });
      i += value.length;
    } else if (code[i] === '`' || code[i] === '"' || code[i] === "'") {
      const q = code[i], j = code.indexOf(q, i + 1);
      tokens.push({ type: 'string', value: code.slice(i, j + 1) });
      i = j + 1;
    } else if (code[i] === '<' && (code[i + 1] !== '/' || code[i + 1] === '/')) {
      const tagMatch = code.slice(i).match(/^<\/?[A-Za-z][A-Za-z0-9.]*/);
      tokens.push({ type: 'jsxTag', value: tagMatch ? tagMatch[0] : '<' });
      i += tagMatch ? tagMatch[0].length : 1;
    } else if (/[{}()\[\]]/.test(code[i])) {
      tokens.push({ type: code[i] === '{' || code[i] === '}' ? 'brace' : code[i] === '(' || code[i] === ')' ? 'paren' : 'bracket', value: code[i] });
      i++;
    } else if (/[0-9]/.test(code[i])) {
      const j = code.slice(i).search(/[^\d._xXa-fA-F]/);
      tokens.push({ type: 'number', value: code.slice(i, j + i) });
      i += j;
    } else if (/[A-Za-z_$]/.test(code[i])) {
      const j = code.slice(i).search(/[^\w$]/), word = code.slice(i, j + i), after = code.slice(i + j).trim();
      tokens.push({ type: after.startsWith('=') && !after.startsWith('=>') ? 'jsxAttr' : KEYWORDS.has(word) ? 'keyword' : TYPES.has(word) ? 'type' : 'plain', value: word });
      i += j;
    } else if (/[=+\-*/%&|^~!?:@]/.test(code[i])) {
      const op = code.slice(i, i + 3).match(/^(===|!==|\.\.\.|==|!=|<=|>=|&&|\|\||\?\?|=>|\+\+|--|\*\*|\+=|-=|\*\*)/);
      tokens.push({ type: 'operator', value: op ? op[0] : code[i] });
      i += op ? op[0].length : 1;
    } else if (/[,;.]/.test(code[i])) {
      tokens.push({ type: 'punctuation', value: code[i++] });
    } else {
      tokens.push({ type: 'plain', value: code[i++] });
    }
  }
  return tokens;
}

const SyntaxHighlightedCode: React.FC<{ code: string; language?: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    Clipboard.setString(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = tokenize(code).reduce((acc: any, tok, idx) => {
    tok.value === '\n' ? acc.push([]) : acc[acc.length - 1].push(tok);
    return acc;
  }, [[]]).filter((line: any) => line.length > 0);

  return (
    <View style={{ backgroundColor: '#0d1117', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(203, 152, 252, 0.25)', marginVertical: 8, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: 'rgba(203, 152, 252, 0.12)', backgroundColor: 'rgba(203, 152, 252, 0.05)' }}>
        {['#f07178', '#ffcb6b', '#c3e88d'].map((color, idx) => (
          <View key={idx} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: idx === 2 ? 12 : 6 }} />
        ))}
        <Text style={{ color: 'rgba(203,152,252,0.45)', fontSize: 11, fontFamily: 'monospace', letterSpacing: 1, flex: 1 }}>{(language && language !== 'text') ? language.toLowerCase() : ''}</Text>
        <TouchableOpacity onPress={handleCopy} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: copied ? 'rgba(195, 232, 141, 0.4)' : 'rgba(203, 152, 252, 0.2)', backgroundColor: copied ? 'rgba(195, 232, 141, 0.08)' : 'rgba(203, 152, 252, 0.08)' }}>
          {copied ? <Check size={11} color="#c3e88d" /> : <Copy size={11} color="rgba(203,152,252,0.6)" />}
          <Text style={{ marginLeft: 4, fontSize: 10, fontFamily: 'monospace', color: copied ? '#c3e88d' : 'rgba(203,152,252,0.6)', letterSpacing: 0.5 }}>{copied ? 'copied!' : 'copy'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 12, paddingVertical: 10 }} contentContainerStyle={{ flexDirection: 'column' }}>
        <View>
          {lines.map((line, lineIdx) => (
            <View key={lineIdx} style={{ flexDirection: 'row', minHeight: 20 }}>
              <Text style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'monospace', fontSize: 12, lineHeight: 20, marginRight: 14, minWidth: 20, textAlign: 'right', userSelect: 'none' }}>{lineIdx + 1}</Text>
              {line.map((tok, tokIdx) => (
                <Text key={tokIdx} style={{ color: TOKEN_COLORS[tok.type], fontFamily: 'monospace', fontSize: 13, lineHeight: 20 }}>{tok.value}</Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const markdownStyles = {
  body: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 } as const,
  paragraph: { color: '#FFFFFF', marginTop: 0, marginBottom: 8 } as const,
  text: { color: '#FFFFFF' } as const,
  strong: { color: '#FFFFFF', fontWeight: '700' as const } as const,
  em: { color: '#F3F4F6', fontStyle: 'italic' as const } as const,
  link: { color: '#60A5FA', textDecorationLine: 'underline' as const } as const,
  list_item: { color: '#FFFFFF' } as const,
  bullet_list: { color: '#FFFFFF' } as const,
  ordered_list: { color: '#FFFFFF' } as const,
  heading1: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' as const, marginBottom: 8 } as const,
  heading2: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' as const, marginBottom: 6 } as const,
  heading3: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' as const, marginBottom: 4 } as const,
  blockquote: { backgroundColor: '#374151', borderLeftColor: '#60A5FA', borderLeftWidth: 4, paddingLeft: 12, paddingVertical: 8, marginVertical: 8, color: '#F3F4F6' } as const,
  code_inline: { borderWidth: 0.1, borderColor: 'rgba(204, 152, 252, 0)', backgroundColor: '#261f37', color: '#cb98fc', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, opacity: 0.5, fontFamily: 'monospace', fontSize: 13 } as const,
};

const markdownRules = {
  fence: (node: any) => (
    <SyntaxHighlightedCode key={node.key} code={node.content ? node.content.trim() : ''} language={node.sourceInfo || 'text'} />
  ),
};

interface DevChatBubbleProps {
  userMessage: string;
  aiMessage: string;
  isLoading: boolean;
  userData: any;
  attachedFileNames?: string[];
  artifact?: ArtifactData | null;
  onOpenArtifact?: (artifact: ArtifactData) => void;
}

const DevChatBubble: React.FC<DevChatBubbleProps> = ({ userMessage, aiMessage, isLoading, userData, attachedFileNames = [], artifact, onOpenArtifact }) => {
  const [isUserExpanded, setIsUserExpanded] = useState(false);
  const isUserMessageLong = userMessage.length > 200 || userMessage.split('\n').length > 3;
  const getTruncatedMessage = (msg: string) => msg.length > 200 ? msg.slice(0, 200) + '...' : msg.split('\n').length > 2 ? msg.split('\n').slice(0, 2).join('\n') + '...' : msg;

  return (
    <View className="mb-6">
      <View className="flex-row justify-end mb-2 items-start">
        <View className="max-w-[80%]">
          {attachedFileNames.length > 0 && (
            <View className="mb-2 flex-row flex-wrap">
              {attachedFileNames.map((name, i) => (
                <View key={i} className="bg-indigo-700 rounded-lg px-2 py-1 mr-2 mb-1">
                  <Text className="text-white text-xs">📄 {name}</Text>
                </View>
              ))}
            </View>
          )}
          <View className="items-end mb-3">
            <View style={{ maxWidth: '100%', borderRadius: 20, borderTopRightRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.25)' }}>
              <LinearGradient colors={['rgba(88, 71, 121, 0.7)', 'rgba(64, 48, 95, 0.5)', 'rgba(158, 114, 216, 0.15)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
                <Text style={{ color: colors.text.primary, fontSize: 14.5, lineHeight: 21, letterSpacing: 0.1 }}>{isUserMessageLong && !isUserExpanded ? getTruncatedMessage(userMessage) : userMessage}</Text>
                {isUserMessageLong && (
                  <TouchableOpacity onPress={() => setIsUserExpanded(!isUserExpanded)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10, backgroundColor: 'rgba(139, 92, 246, 0.15)' }}>
                    <Text style={{ color: colors.primaryGlow, fontSize: 11, fontWeight: '500', marginRight: 3 }}>{isUserExpanded ? 'Show less' : 'Show more'}</Text>
                    {isUserExpanded ? <ChevronUp size={12} color={colors.primaryGlow} /> : <ChevronDown size={12} color={colors.primaryGlow} />}
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </View>
          </View>
        </View>
        <Image source={userData?.avatar_url ? { uri: userData.avatar_url } : require('@/assets/images/no-profile.png')} style={{ width: 32, height: 32, borderRadius: 16, marginTop: 18, marginLeft: 8 }} />
      </View>
      <View className="flex-row justify-start items-start">
        <View className="max-w-[85%] px-4 py-3">
          {isLoading ? (
            <View className="flex-row items-center space-x-1 py-2">
              {[0, 100, 200].map((delay, i) => (
                <View key={i} className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </View>
          ) : (
            <View>
              {aiMessage.match(/