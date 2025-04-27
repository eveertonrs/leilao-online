import bcrypt from 'bcrypt';

console.log('🔐 Iniciando geração de hash...');

const senha = '123456'; // Altere aqui se quiser testar outra senha

bcrypt.hash(senha, 10)
  .then((hash) => {
    console.log(`✅ Hash gerada para a senha "${senha}":`);
    console.log(hash);
  })
  .catch((err) => {
    console.error('❌ Erro ao gerar hash:', err);
  });
