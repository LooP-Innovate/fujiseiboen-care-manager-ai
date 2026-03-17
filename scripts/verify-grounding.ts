/**
 * Grounding Verification Test Case
 * This script tests if the AI can correctly cite evidence from assessment data.
 */
import { AIService } from '../src/services/aiService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const sampleAssessment = `
【氏名】田中 花子 様 (85歳)
【身体状況】
- 右膝に強い痛みがあり、歩行時はシルバーカーを使用している。
- 夜間、トイレに起きる際、ふらつきが見られることがあり転倒リスクが高い。
- 左手には軽微な麻痺があるが、食事は自力で可能。
【希望】
- 住み慣れた自宅で暮らし続けたい。
- 加藤様（友人）と週に一度はお茶をしたい。
`;

async function verifyGrounding() {
    console.log('--- Grounding Verification Start ---');
    
    const onChunk = (chunk) => process.stdout.write(chunk);
    
    try {
        const response = await AIService.runChat(
            'test-session',
            'ケアプラン案',
            `上記アセスメントに基づき、課題と解決策を提案してください。必ず[根拠:...]を含めてください。\n\n${sampleAssessment}`,
            [],
            onChunk,
            'gemini-2.5-flash-lite'
        );

        console.log('\n\n--- Final Content ---');
        console.log(response.content);

        const hasCitations = response.content.includes('[根拠:');
        console.log('\n--- Verification Result ---');
        if (hasCitations) {
            console.log('✅ Evidence tags detected.');
            // Basic sanity check: does it mention the knee or dizziness?
            if (response.content.includes('右膝') || response.content.includes('ふらつき')) {
                console.log('✅ Grounding content appears relevant to input.');
            } else {
                console.warn('⚠️ Citation tags found but content might be generic.');
            }
        } else {
            console.error('❌ No evidence tags found in the response.');
        }

    } catch (err) {
        console.error('Verification failed:', err);
    }
}

verifyGrounding();
