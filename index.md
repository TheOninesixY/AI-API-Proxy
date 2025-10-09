# AI API 代理

## 项目简介

AI API 代理是一个专为国内用户设计的解决方案，旨在帮助开发者和用户顺畅访问国外主流AI服务提供商的API接口，解决因网络限制导致的访问困难问题。

## 功能特点

- 🚀 **简单易用** - 仅需修改API URL，无需复杂配置
- 🔒 **安全可靠** - 不存储或记录用户的API Key
- 🌐 **多平台支持** - 兼容主流的AI服务提供商
- 📦 **轻量高效** - 基于Cloudflare Pages部署，响应迅速

## 支持的服务

| AI服务提供商 | API代理地址 | 官方API申请地址 |
|------------|------------|---------------|
| Google Gemini | `https://gemini.aiapi.pages.dev` | [Google AI Studio](https://aistudio.google.com/api-keys) |
| OpenAI | `https://openai.aiapi.pages.dev` | [OpenAI Platform](https://platform.openai.com) |

## 使用方法

### Google Gemini

1. 在你使用的AI应用程序或开发环境中，将`API URL`设置为：`https://gemini.aiapi.pages.dev`
2. 在`API Key`字段中填写你在[Google AI Studio](https://aistudio.google.com/api-keys)申请的有效API Key
3. 保存设置并开始使用

> **注意：** 申请Google Gemini API Key需要科学上网环境和稳定的Google账号

### OpenAI

1. 在你使用的AI应用程序或开发环境中，将`API URL`设置为：`https://openai.aiapi.pages.dev`
2. 在`API Key`字段中填写你在[OpenAI Platform](https://platform.openai.com)申请的有效API Key
3. 保存设置并开始使用

> **注意：** 申请OpenAI API Key需要科学上网环境

## 开发进度与计划

目前已实现对Google Gemini和OpenAI的基础API代理支持。未来计划添加更多主流AI服务提供商，包括但不限于：
- Anthropic Claude
- Perplexity AI
- Hugging Face
- Mistral AI

## 实用工具推荐

- **[Gemini Balance](https://github.com/snailyp/gemini-balance)** - 创建API Key池，当某个API Key不可用时自动切换到其他可用的API Key，提高服务稳定性

## 免责声明

- 本项目仅提供API代理服务，不保证所有情况下的100%可用性
- 用户需自行确保其API Key的安全性，本项目不对API Key的泄露负责
- 请遵守各AI服务提供商的使用条款和政策

**By [OninesixY](https://github.com/OninesixY)**
