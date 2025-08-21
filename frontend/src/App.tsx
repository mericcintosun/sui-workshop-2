import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<'mint' | 'gallery'>('mint');

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#ffffff'
    }}>
      {/* Header */}
      <Box style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139, 69, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Container size="4">
          <Flex justify="between" align="center" py="4" style={{ flexWrap: 'wrap', gap: '16px' }}>
            <Flex align="center" gap="4" style={{ minWidth: '0', flex: '1' }}>
              <Box style={{
                width: '36px',
                height: '36px',
                background: '#8b45ff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                flexShrink: 0
              }}>
                🎨
              </Box>
              <Box style={{ minWidth: '0', flex: '1' }}>
                <Heading size="5" style={{ 
                  color: 'white', 
                  margin: 0, 
                  fontWeight: '700',
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  lineHeight: '1.2'
                }}>
                  NFT Studio
                </Heading>
                <Text size="1" style={{ 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  margin: 0,
                  fontSize: 'clamp(12px, 3vw, 14px)'
                }}>
                  Digital Art Platform
                </Text>
              </Box>
            </Flex>
            <Box style={{ flexShrink: 0 }}>
              <ConnectButton />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container size="4" py="8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <Box mb="8" style={{ textAlign: 'center', padding: '0 16px' }}>
          <Heading size="7" style={{ 
            color: 'white', 
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #ffffff, #8b45ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'clamp(2rem, 6vw, 2.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>
            Create Digital Art
          </Heading>
          <Text size="3" style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            maxWidth: '500px', 
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '400',
            fontSize: 'clamp(14px, 3.5vw, 16px)'
          }}>
            Mint and manage your unique NFTs on the Sui blockchain
          </Text>
        </Box>

        {/* Tab Navigation */}
        <Box mb="8" style={{ 
          background: 'rgba(0, 0, 0, 0.4)', 
          borderRadius: '12px', 
          padding: '4px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 69, 255, 0.1)',
          maxWidth: '400px',
          margin: '0 auto',
          width: '100%'
        }}>
          <Flex justify="center" gap="1" style={{ width: '100%' }}>
            <Button
              variant={activeTab === 'mint' ? 'solid' : 'ghost'}
              onClick={() => setActiveTab('mint')}
              style={{
                background: activeTab === 'mint' ? 'linear-gradient(45deg, #8b45ff, #6b46c1)' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                flex: '1',
                minWidth: '0',
                whiteSpace: 'nowrap'
              }}
            >
              Create
            </Button>
            <Button
              variant={activeTab === 'gallery' ? 'solid' : 'ghost'}
              onClick={() => setActiveTab('gallery')}
              style={{
                background: activeTab === 'gallery' ? 'linear-gradient(45deg, #8b45ff, #6b46c1)' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                flex: '1',
                minWidth: '0',
                whiteSpace: 'nowrap'
              }}
            >
              Gallery
            </Button>
          </Flex>
        </Box>

        {/* Content Area */}
        <Box style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          padding: 'clamp(16px, 4vw, 32px)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 69, 255, 0.1)',
          minHeight: '500px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <WalletStatus activeTab={activeTab} />
        </Box>

        {/* Footer */}
        <Box mt="8" style={{ textAlign: 'center', padding: '0 16px' }}>
          <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Built on Sui Blockchain
          </Text>
        </Box>
      </Container>
    </div>
  );
}

export default App;
