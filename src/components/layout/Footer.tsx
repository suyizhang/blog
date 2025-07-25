import React from 'react'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/yourusername',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/yourusername',
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: 'mailto:your.email@example.com',
      icon: Mail,
    },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container-max section-padding py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© {currentYear} Your Name. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>using React & TypeScript</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                  aria-label={link.name}
                >
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <a
              href="/privacy"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              隐私政策
            </a>
            <a
              href="/terms"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              使用条款
            </a>
            <a
              href="/sitemap"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              网站地图
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer