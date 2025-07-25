import React from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { User, Mail, MapPin, Building, Link as LinkIcon, Github } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    )
  }

  const userInfo = [
    {
      icon: User,
      label: 'Username',
      value: user.login
    },
    {
      icon: Mail,
      label: 'Email',
      value: user.email || 'Not provided'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: user.location || 'Not specified'
    },
    {
      icon: Building,
      label: 'Company',
      value: user.company || 'Not specified'
    },
    {
      icon: LinkIcon,
      label: 'Website',
      value: user.blog || 'Not provided'
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="section-padding py-20">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Welcome back, {user.name || user.login}!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="card p-8 text-center">
                <img
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg"
                />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name || user.login}
                </h2>
                {user.bio && (
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {user.bio}
                  </p>
                )}
                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 btn-primary px-6 py-3"
                >
                  <Github className="w-5 h-5" />
                  <span>View GitHub Profile</span>
                </a>
              </div>
            </motion.div>

            {/* User Information */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="card p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Account Information
                </h3>
                <div className="space-y-4">
                  {userInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {info.label}
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Session Management
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage your current session
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a
                  href="/"
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    View Portfolio
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Go to homepage
                  </p>
                </a>

                <a
                  href="/projects"
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    My Projects
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View all projects
                  </p>
                </a>

                <a
                  href="/contact"
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Contact
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get in touch
                  </p>
                </a>

                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Github className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    GitHub
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View profile
                  </p>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard